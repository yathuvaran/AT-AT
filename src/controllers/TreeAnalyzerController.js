export default class TreeAnalyzerController {
  /**
   * Calculates the paths for a tree.
   * @param {object} tree A tree .
   * @return {Array} The list of paths.
   */
  generatePaths(tree) {
    let paths = [];
    //base case; if a leaf node or root node by itself
    if (!("children" in tree)) {
      // Add an array to paths with the current node.
      paths.push([tree["ID"]]);
      console.log(paths);
      return paths;
    }
    //is a parent node
    else {
      // Get children from the current node.
      var children = tree["children"];
      // Iterate across children and generate paths.
      for (var i = 0; i < children.length; i++) {
        var result = this.generatePaths(children[i]);
        console.log(result);
        if (tree["operator"] === "OR") {
          // For each path in the result, add the current node id to the front of the path.
          for (var j = 0; j < result.length; j++) {
            //result[j].unshift(tree["ID"]);
            // Add resulting path to list of paths to return.
            paths.push(result[j]);
          }
        } else { //AND node
            if (paths.length > 0) {
            var newPaths = []
            for (var j = 0; j < result.length; j++) {
                for(var k = 0; k < paths.length; k++) {
                    var tempPaths = JSON.parse(JSON.stringify(paths));
                    tempPaths[k].push(result[j])
                    newPaths.push(tempPaths[k].flat())
                }
            }
            // assign deep copy to path
            console.log("before ", newPaths)
            paths = JSON.parse(JSON.stringify(newPaths));
            console.log("after ", paths)
        }
        else {
            //asign deep copy to path
            console.log("before else", result)
            paths = JSON.parse(JSON.stringify(result));
            console.log("after else", paths)
        }
        console.log(paths);
            // Add resulting path to list of paths to return.
            //paths = paths.flat();
        }
      }
      // Iterate across paths and add current node id at front.
      for (var j = 0; j < paths.length ; j++) {
        paths[j].unshift(tree["ID"]);
    }
      console.log(paths);
      return paths;
    }
  }
}
