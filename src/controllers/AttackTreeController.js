export default class AttackTreeController {
  patternMatch(text) {
    // TODO: Fix regex variable name to something like leafRegex.
    // new pattern matcher 
    // const regex =  /^(\t*[\W|\w|\s]+)$/g;

    //split second half of line to get node name stuff
    // const str = '		 	~12`*	adwasd	hello';

    // var words = str.split(/^\t*/g);
    // console.log(words);

    //counting number of tabs before our node name starts
    // var numOfTabs = 0;
    // var start = 0;
    // while ( str.charAt( start++ ) == "\t" ) numOfTabs++;
    // console.log(numOfTabs)
    // TODO: Convert all variables to camelCase.

    // D3 library also sanitizes input (e.g., won't allow tabs).
    // Old regex = /^([1-9]|([1-9][0-9]+))\|\w+/g
    const regex = /^(\t*[\W|\w|\s]+)$/g;
    var str = text.match(regex);
    if (str == null || this.getLineText(str[0]).includes("\t")) {
      console.log("must have \"tab text\"");
      return [false, "Format Error","must have \"tab text\""];
    }
    return [true];
  }

  calcNumberOfTabs(line) {
    var numOfTabs = 0;
    var start = 0;
    while ( line.charAt( start++ ) === "\t" ) numOfTabs++;
    console.log(numOfTabs)
    return numOfTabs + 1
  }

  getLineText(line) {
    var words = line.split(/^\t*/g);
    if (words.length === 1){
      return words[0]
    }
    return words[1]
  }

  patternVerify(curr_num, prev_num, prevLineType) {
    //let pipeSplit = text.split("|");
    if (!(curr_num > 1 && curr_num <= parseInt(prev_num, 10) + 1)) {
      console.log(
        "num must be in range 2...prevnum + 1",
        curr_num,
        prev_num + 1,
        prevLineType
      );
      return [false, "Verification Error", "num must be in range 2...prevnum + 1"];
    }

    //check if prev line was a node, then currNum must be greater
    if (prevLineType === "Node") {
      if (!(curr_num > prev_num)) {
        console.log("node cannot");
        return [false, "Verifcation Error","node cannot"];
      }
    }

    //check if prev line was a leaf, then curr num must be less or equal
    if (prevLineType === "Leaf") {
      if (!(curr_num <= prev_num)) {
        console.log("leaf cannot");
        return [false, "Verification Error","leaf cannot"];
      }
    }

    return [true];
  }

  parseDSL(text) {
    text = text.trim();
    var output = "";
    var lines = text.split("\n");
    for (var i = 0; i < lines.length; i++) {
      var result = this.patternMatch(lines[i])
      if (result[0] === false) {
        Window.map.openNotificationWithIcon('error', result[1], result[2])
        return;
        // stop execution
      }
    }

    //stacks
    var squareBrackets = [];
    var curlyBraces = [];

    // initally first line
    //str.split(/^\t*/g)
    //var prevLineNum = lines[0].split("|");
    // The number of tabs is really the depth level.
    var prevLineNum = this.calcNumberOfTabs(lines[0])
    

    if (prevLineNum !== 1) {
      console.log("Should start with a 1");
      return;
    }
    var second_split = this.getLineText(lines[0]).split(";");

    if (lines.length === 1) {
      //must be leaf
      if (!this.verifyMetrics(second_split)) {
        console.log("Metrics Bad");
        return;
        // stop execution
      }
      //check for metrics
      output += '[{"name":"' + second_split[0] + '"';
      let metrics_map = this.getLeafMetrics(second_split);
      //iterate over key, value pairs in metrics mapping
      for (const [key, value] of Object.entries(metrics_map)) {
        output += ',"' + key + '": ' + value;
      }
      squareBrackets.push("]");
      curlyBraces.push("}");
    } else {
      //must be node
      const regex = /\w+;(OR|AND)$/g;
      if (this.getLineText(lines[0]).match(regex) === null) {
        //console.log(lines[i]);
        console.log("Node syntax bad");
        return;
        // stop execution
      }
      output +=
        '[{"name":"' +
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
      curr_num = this.calcNumberOfTabs(lines[i])
      var result = this.patternVerify(curr_num, prev_num, prevLineType)
      if (!result[0]) {
        Window.map.openNotificationWithIcon('error', result[1], result[2])
        console.log(lines[i]);
        return;
        // stop execution
      }

      // var first_split = lines[i].split("|");
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
      curlyBraces.push("}");

      // Identifying leaf nodes:
      if (i < lines.length - 1) {
        //var third_split = lines[i + 1].split("|");
        var next_num = this.calcNumberOfTabs(lines[i+1])
        if (next_num <= curr_num) {
          prevLineType = "Leaf";
          //verify metrics before
          if (!this.verifyMetrics(second_split)) {
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
          //output += ',"L":"True"';
        } else {
          prevLineType = "Node";
          // verify node snytax
          const regex = /\w+;(OR|AND)$/g;
          // the actual text for the node for the current line
          // Get the unsplit version of the actual text.
          if (this.getLineText(lines[i]).match(regex) === null) {
            console.log(lines[i]);
            console.log("Node syntax bad");
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
        if (!this.verifyMetrics(second_split)) {
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
    Window.map.setTreeData(output.substring(1, output.length - 1));
  }

  // TODO: Remove function, deprecated.
  //splitDSL(text) {
  //  console.log(text);
  //  var first_split = text.split("|");
  //  var second_split = first_split[1].split(";");
  //  return [first_split, second_split];
  //}

  static metricsArr = ["l", "v", "r", "t"];

  verifyMetrics(metrics) {
    var set = new Set();
    // Regex to ensure metrics are properly formatted.
    const regex = /^\w=(1\.0|[0]\.\d|[0-1])$/g;
    for (var i = 1; i < metrics.length; i++) {
      //check for proper syntax
      if (metrics[i].match(regex) == null) {
        return false;
      }
      var key_val = metrics[i].split("=");
      if (!AttackTreeController.metricsArr.includes(key_val[0])) {
        return false;
      }
      set.add(key_val[0]);
    }
    return set.size === metrics.length - 1;
  }

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
