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


    const regex = /^([1-9]|([1-9][0-9]+))\|\w+/g;
    if (text.match(regex) == null) {
      // TODO: Change return?
      console.log("must have num|text");
      return [false, "must have num|text"];
    }
    return [true];
  }

  patternVerify(text, prev_num, prevLineType) {
    let pipeSplit = text.split("|");
    if (!(pipeSplit[0] > 1 && pipeSplit[0] <= parseInt(prev_num, 10) + 1)) {
      console.log(
        "num must be in range 2...prevnum + 1",
        pipeSplit[0],
        prev_num + 1,
        prevLineType
      );
      return [false, "num must be in range 2...prevnum + 1"];
    }

    var curr_num = pipeSplit[0];
    //check if prev line was a node, then curr_num must be greater
    if (prevLineType === "Node") {
      if (!(curr_num > prev_num)) {
        console.log("node cannot");
        return [false, "node cannot"];
      }
    }

    //check if prev line was a leaf, then curr num must be less or equal
    if (prevLineType === "Leaf") {
      if (!(curr_num <= prev_num)) {
        console.log("leaf cannot");
        return [false, "leaf cannot"];
      }
    }

    return [true];
  }

  parseDSL(text) {
    text = text.trim();
    var output = "";
    var lines = text.split("\n");
    for (var i = 0; i < lines.length; i++) {
      if (this.patternMatch(lines[i])[0] === false) {
        console.log("send pop up indicate line #");
        return;
        // stop execution
      }
    }

    //stacks
    var squareBrackets = [];
    var curlyBraces = [];

    // initally first line
    var prev_split = lines[0].split("|");
    var second_split = prev_split[1].split(";");

    if (prev_split[0] != 1) {
      console.log("Should start with a 1");
      return;
    }

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
      if (prev_split[1].match(regex) === null) {
        console.log(lines[i]);
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

    for (i = 1; i < lines.length; i++) {
      var prev_num = prev_split[0];
      if (!this.patternVerify(lines[i], prev_num, prevLineType)[0]) {
        console.log(lines[i]);
        return;
        // stop execution
      }

      var first_split = lines[i].split("|");
      var curr_num = first_split[0];
      var second_split = first_split[1].split(";");

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
        var third_split = lines[i + 1].split("|");
        var next_num = third_split[0];
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
          if (first_split[1].match(regex) === null) {
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

      prev_split = first_split;
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
