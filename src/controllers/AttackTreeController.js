import D3Test from "./D3Test";
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
          output += '"name":' + second_split[0] 
          let metrics_map = this.verifyMetrics(second_split)
          //iterate over key, value pairs in metrics mapping
          for (const [key, value] of Object.entries(metrics_map)) {
            output += ',' + '"' + key + '"' + ': ' + value 
          }
          //output += ',"L":"True"';
          

        }
        else {
          output += '"name":' + second_split[0] + ',"operator":' + second_split[1];
        }
      } else  {
        //check for metrics
        output += '"name":' + second_split[0] 
        let metrics_map = this.verifyMetrics(second_split)
        //iterate over key, value pairs in metrics mapping
        for (const [key, value] of Object.entries(metrics_map)) {
          output += ',' + '"' + key + '"' + ': ' + value 
        }
      }

      prev_split = first_split;
    }

    console.log(squareBrackets.length);
    console.log(curlyBraces.length);
    var count = squareBrackets.length;
    for (i = 0; i < count; i++) {
      output += curlyBraces.pop();
      output += squareBrackets.pop();
    }
    console.log(squareBrackets);
    console.log(curlyBraces);

    const d3Tree = new D3Test()
    d3Tree.createD3(output)
    console.log(output);

    
  }

  splitDSL(text) {
    console.log(text);
    var first_split = text.split("|");
    var second_split = first_split[1].split(";");
    return [first_split, second_split];
  }

  verifyMetrics(metrics){
    var output = {}
    //case where only name is provided 
    if (metrics.length === 1){
      return output
    }
    for (var i = 1; i < metrics.length; i++){
      var key_val = metrics[i].split("=")
      output[key_val[0]] = key_val[1]
    }
    return output
  }

}
