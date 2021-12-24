import TreeAnalyzerController from "./TreeAnalyzerController";

export default class AttackTreeController {
  patternMatch(text) {
    // D3 library also sanitizes input (e.g., won't allow tabs, cleans whitespace).
    const lineRegex = /^(\t*[\W|\w|\s]+)$/g;
    var str = text.match(lineRegex);
    // If we do not match on the regex or str includes tab (potentially in the name) or str is blank
    if (str == null || this.getLineText(str[0]).includes("\t") || !text.trim()) {
      // Return a format error.
      console.log('must have "tab text"');
      return [false, "Format Error", "Line must have tabs followed by text"];
    }
    return [true];
  }

  /**
   * Calculates the number of tabs for a line.
   * @param {string} line A line to calculate the number of tabs.
   * @return {number} The number of tabs.
   */
  calcNumberOfTabs(line) {
    var numOfTabs = 0;
    var start = 0;
    while (line.charAt(start++) === "\t") numOfTabs++;
    console.log(numOfTabs);
    // Return numOfTabs + 1 because we start at depth of 1.
    return numOfTabs + 1;
  }

  /**
   * Gets the text for a line.
   * @param {string} line A line to get the text.
   * @return {string} The text of the line.
   */
  getLineText(line) {
    var words = line.split(/^\t*/g);
    if (words.length === 1) {
      return words[0];
    }
    return words[1];
  }

  /**
   * Verify the pattern.
   * @param {number} curr_num A current line number of tabs.
   * @param {number} prev_num A previous line number of tabs.
   * @param {string} prevLineType A previous line type.
   * @return {Array} The result of verifying the pattern.
   */
  patternVerify(curr_num, prev_num, prevLineType) {
    //let pipeSplit = text.split("|");
    if (!(curr_num > 1 && curr_num <= parseInt(prev_num, 10) + 1)) {
      return [false, "Syntax Error", "Tab Indentation Error"];
    }

    //check if prev line was a node, then currNum must be greater
    if (prevLineType === "Node") {
      if (!(curr_num > prev_num)) {
        console.log("node cannot");
        return [false, "Syntax Error", "Node should be child of previous line"];
      }
    }

    //check if prev line was a leaf, then curr num must be less or equal
    if (prevLineType === "Leaf") {
      if (!(curr_num <= prev_num)) {
        console.log("leaf cannot");
        return [false, "Syntax Error", "Leaf cannot have children"];
      }
    }

    return [true];
  }

  /**
   * Show an error.
   * @param {string} title A title for an error.
   * @param {string} description A description for an error.
   * @param {number} lineNum A line number.
   */
  showError(title, description, lineNum) {
    Window.map.openNotificationWithIcon(
      "error",
      title,
      "Error at line: " + lineNum + "\n" + description
    );
  }

  /**
   * Parse the DSL.
   * @param {string} text A line of text.
   * @return {Array} The result of verifying the pattern.
   */
  parseDSL(text) {
    text = text.trim();
    var output = "";
    var lines = text.split("\n");

    //initial pass on text to ensure it has good form
    for (var i = 0; i < lines.length; i++) {
      var result = this.patternMatch(lines[i]);
      if (result[0] === false) {
        this.showError(result[1], result[2], i + 1);
        return;
        // stop execution
      }
    }

    var identifier = 0;

    //regex for node syntax
    const nodeRegex = /\w+;(OR|AND)$/g;

    //stacks
    var squareBrackets = [];
    var curlyBraces = [];

    // The number of tabs is really the depth level.
    var prevLineNum = this.calcNumberOfTabs(lines[0]);

    if (prevLineNum !== 1) {
      console.log("Should start with no tab");
      this.showError("Start Tab", "Should start with no tab", 1);
      return;
    }
    var second_split = this.getLineText(lines[0]).split(";");

    output += "[{";
      output += "\"ID\": " + identifier + ",";
      identifier++;

    if (lines.length === 1) {
      //must be leaf
      let metricsVerif = this.verifyMetrics(second_split);
      if (!metricsVerif[0]) {
        console.log("Metrics Bad");
        this.showError(metricsVerif[1], metricsVerif[2], 1);
        return;
        // stop execution
      }
      //check for metrics
      output += '"name":"' + second_split[0] + '"';
      let metrics_map = this.getLeafMetrics(second_split);
      //iterate over key, value pairs in metrics mapping
      for (const [key, value] of Object.entries(metrics_map)) {
        output += ',"' + key + '": ' + value;
      }
      squareBrackets.push("]");
      curlyBraces.push("}");
    } else {
      //must be node
      if (this.getLineText(lines[0]).match(nodeRegex) === null) {
        console.log("Node syntax bad");
        this.showError("Verification Error", "Must be <text>;<OR|AND>", 1);
        return;
        // stop execution
      }
      output +=
        '"name":"' +
        second_split[0] +
        '", "operator":"' +
        second_split[1] +
        '"';
      squareBrackets.push("]");
      curlyBraces.push("}");
    }

    var prevLineType = "Node";

    var curr_num;
    var prev_num;
    for (i = 1; i < lines.length; i++) {
      prev_num = prevLineNum;
      curr_num = this.calcNumberOfTabs(lines[i]);
      var result = this.patternVerify(curr_num, prev_num, prevLineType);
      if (!result[0]) {
        this.showError(result[1], result[2], i + 1);
        return;
        // stop execution
      }

      second_split = this.getLineText(lines[i]).split(";");

      // if curr node is not a neighbor to previous node
      // or is a level above the previous node
      if (curr_num < prev_num) {
        var count = Math.abs(prev_num - curr_num);
        for (var j = 0; j < count; j++) {
          output += curlyBraces.pop();
          output += squareBrackets.pop();
          if (j === count - 1) {
            output += curlyBraces.pop();
            output += ",";
          }
        }
      } else if (curr_num > prev_num) {
        output += ', "children": [';
        squareBrackets.push("]");
      } else {
        output += curlyBraces.pop() + ",";
      }

      output += "{";
      output += "\"ID\": " + identifier + ",";
      identifier++;
      curlyBraces.push("}");

      // Identifying leaf nodes:
      if (i < lines.length - 1) {
        var next_num = this.calcNumberOfTabs(lines[i + 1]);
        if (next_num <= curr_num) {
          prevLineType = "Leaf";
          //verify metrics before
          let metricsVerif = this.verifyMetrics(second_split);
          if (!metricsVerif[0]) {
            this.showError(metricsVerif[1], metricsVerif[2], i + 1);
            console.log("Metrics Bad");
            return;
            // stop execution
          }
          //check for metrics
          output += '"name":"' + second_split[0] + '"';
          let metrics_map = this.getLeafMetrics(second_split);
          //iterate over key, value pairs in metrics mapping
          for (const [key, value] of Object.entries(metrics_map)) {
            output += ',"' + key + '":' + value;
          }

        } else {
          prevLineType = "Node";
          // verify node snytax

          // the actual text for the node for the current line
          // Get the unsplit version of the actual text.
          if (this.getLineText(lines[i]).match(nodeRegex) === null) {
            console.log(lines[i]);
            console.log("Node syntax bad");
            this.showError(
              "Verification Error",
              "Must be <text>;<OR|AND>",
              i + 1
            );
            return;
            // stop execution
          }
          output +=
            '"name":"' +
            second_split[0] +
            '","operator":"' +
            second_split[1] +
            '"';
        }
      } else {
        let metricsVerif = this.verifyMetrics(second_split);
        if (!metricsVerif[0]) {
          this.showError(metricsVerif[1], metricsVerif[2], i + 1);
          console.log("Metrics Bad");
          return;
          // stop execution
        }
        //check for metrics
        output += '"name":"' + second_split[0] + '"';
        let metrics_map = this.getLeafMetrics(second_split);
        //iterate over key, value pairs in metrics mapping
        for (const [key, value] of Object.entries(metrics_map)) {
          output += ',"' + key + '": ' + value;
        }
      }

      prevLineNum = curr_num;
    }

    console.log(squareBrackets.length);
    console.log(curlyBraces.length);
    count = squareBrackets.length;
    for (i = 0; i < count; i++) {
      output += curlyBraces.pop();
      output += squareBrackets.pop();
    }

    // Set tree data removing square brackets from start and end
    console.log(output);
    Window.map.openNotificationWithIcon(
      "success",
      "Tree Generation Successful",
      ""
    );
    Window.map.setTreeData(output.substring(1, output.length - 1));
    const treeAnalyzerController = new TreeAnalyzerController();
    console.log(treeAnalyzerController.analyzeTree(
      JSON.parse(output.substring(1, output.length - 1))
    ));
  }

  /**
   * Verify the metrics.
   * @param {string} metrics A string of metrics.
   * @return {Array} The result of verifying the metrics.
   */
  verifyMetrics(metrics) {
    // all metrics values we use in our system
    var metricsArr = ["l", "v", "r", "t"];
    var set = new Set();
    // Regex to ensure metrics are properly formatted.
    const regex = /^\w=(1\.0|[0]\.\d|[0-1])$/g;
    for (var i = 1; i < metrics.length; i++) {
      //check for proper syntax
      if (metrics[i].match(regex) == null) {
        return [
          false,
          "Incorrect Leaf Syntax",
          "Leaf not formatted correctly. Should have <Text>;Optional Metrics",
        ];
      }
      var key_val = metrics[i].split("=");
      if (!metricsArr.includes(key_val[0])) {
        return [
          false,
          "Incorrect Metrics Syntax",
          "Metric(s) Value should be l,v,r, or t",
        ];
      }
      set.add(key_val[0]);
    }
    return [set.size === metrics.length - 1];
  }

  /**
   * Get the leaf metrics.
   * @param {string} metrics A string of metrics.
   * @return {object} The result getting the leaf metrics.
   */
  getLeafMetrics(metrics) {
    var output = {};
    //case where only name is provided
    if (metrics.length === 1) {
      return output;
    }
    for (var i = 1; i < metrics.length; i++) {
      var key_val = metrics[i].split("=");
      output[key_val[0]] = key_val[1];
    }
    return output;
  }
}
