import D3Test from "./D3Test";
import React from "react";
import ReactDOM from "react-dom";
import Tree from "react-d3-tree";

const tree_data = {
  name: "openSafe",
  operator: "OR",
  children: [
    {
      name: "ForceOpen",
      operator: "OR",
      children: [
        { name: "Dynamite", r: 0, t: 0.1 },
        { name: "Throw Out Window" },
      ],
    },
    {
      name: "Pick Lock",
      operator: "AND",
      children: [
        { name: "Insert Bobby Pin", l: 0.9, v: 0.3 },
        { name: "Pick With Bobby Pin", l: 0.8 },
      ],
    },
  ],
};

export default class AttackTreeController {
  parseDSL(text) {
    text = text.trim();
    var output = "";
    var lines = text.split("\n");
    var prev_line = lines[0];
    var prev_split = this.splitDSL(prev_line);

    //stacks
    var squareBrackets = [];
    var curlyBraces = [];

    output +=
      '[{"name":' + prev_split[1][0] + ',"operator":' + prev_split[1][1];
    squareBrackets.push("]");
    curlyBraces.push("}");
    for (var i = 1; i < lines.length; i++) {
      var first_split = lines[i].split("|");
      var curr_num = first_split[0];
      var prev_num = prev_split[0];
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
          //check for metrics
          output += '"name":' + second_split[0];
          let metrics_map = this.verifyMetrics(second_split);
          //iterate over key, value pairs in metrics mapping
          for (const [key, value] of Object.entries(metrics_map)) {
            output += "," + '"' + key + '"' + ": " + value;
          }
          //output += ',"L":"True"';
        } else {
          output +=
            '"name":' + second_split[0] + ',"operator":' + second_split[1];
        }
      } else {
        //check for metrics
        output += '"name":' + second_split[0];
        let metrics_map = this.verifyMetrics(second_split);
        //iterate over key, value pairs in metrics mapping
        for (const [key, value] of Object.entries(metrics_map)) {
          output += "," + '"' + key + '"' + ": " + value;
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
    console.log(squareBrackets);
    console.log(curlyBraces);

    //remove child of tree container
    while (ReactDOM.unmountComponentAtNode(document.getElementById("tree"))) {
    }
    // Delete children

    //put output instead of tree_data later
    var tree_elem = React.createElement(Tree, {orientation:"vertical" ,data:tree_data})
    ReactDOM.render(
      tree_elem,
      document.getElementById('tree')
    )
    console.log(output);
  }

  splitDSL(text) {
    console.log(text);
    var first_split = text.split("|");
    var second_split = first_split[1].split(";");
    return [first_split, second_split];
  }

  verifyMetrics(metrics) {
    var output = {};
    //case where only name is provided
    if (metrics.length === 1) {
      return output;
    }
    for (var i = 1; i < metrics.length; i++) {
      var key_val = metrics[i].split("=");
      output[key_val[0]] = key_val[1];
    }
    return output
  }
}
