export default class AttackTreeController {
  parseDSL(text) {
    var output = "";
    var lines = text.split("\n");
    var prev_line = lines[0];
    var prev_split = this.splitDSL(prev_line);

    //stacks
    var squareBrackets = [];
    var curlyBraces = [];

    output +=
      '[{"name":' + prev_split[1][0] + ',"operator":' + prev_split[1][1] + ",";
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
          output += squareBrackets.pop()
          output += curlyBraces.pop()
        }
      }
      else if (curr_num > prev_num){
        output += ', "children": ['
        squareBrackets.push("]");
      }
      else {
        output += curlyBraces.pop()
      }

      output += ", {";
      curlyBraces.push("}");
        output +=
          '"name":' +
          second_split[0] +
          ',"operator":' +
          second_split[1];


      // // Logic for {} brackets
      // if (curr_num === prev_num) {
      //   output += curlyBraces.pop()
      // }
      // if (curr_num <= prev_num) {
      //   var count = Math.abs(prev_num - curr_num) + 1;
      //   for (var j = 0; j < count; j++) {
      //     output += curlyBraces.pop() + ",";
      //   }
      //   // Logic for [] brackets
      //   if (curr_num < prev_num) {
      //     var count2 = Math.abs(prev_num - curr_num);
      //     for (var j2 = 0; j2 < count2; j2++) {
      //       output += squareBrackets.pop();
      //     }
      //   }
      // else {
      //   output += '"children:" ['
      //   output += "{";
      //   curlyBraces.push("}");
      //   output +=
      //     '"name":' +
      //     second_split[0] +
      //     ',"operator":' +
      //     second_split[1];

        
      //   output += "{";
      //   curlyBraces.push("}");
      // } 
      //   output += "{";
      //   curlyBraces.push("}");
      //   squareBrackets.push("]");
      //   output +=
      //     '"name":' +
      //     second_split[0] +
      //     ',"operator":' +
      //     second_split[1];
      // }
      prev_split = first_split
    }

    for(i = 0; i < squareBrackets.length - 1; i++) {
      output += curlyBraces.pop();
      output += squareBrackets.pop()
      output += curlyBraces.pop()
    }
    output += curlyBraces.pop();
      output += squareBrackets.pop()

    
    console.log(output)
  }

  splitDSL(text) {
    console.log(text)
    var first_split = text.split("|");
    var second_split = first_split[1].split(";");
    return [first_split, second_split];
  }
}
