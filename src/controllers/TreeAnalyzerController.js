export default class TreeAnalyzerController {
  /**
   * Analyzes a tree.
   * @param {object} tree A tree.
   * @return {Array} The list of paths.
   */
  analyzeTree(tree) {
    // Initialize empty path severity array.
    var pathSeverity = [];
    // Get the generated paths for a tree.
    var paths = this.generatePaths(tree);
    // Iterate across paths and add to the front of pathSeverity.
    // Creating an object with an empty id array and a 0 severity.
    for (var i = 0; i < paths.length; i++) {
      pathSeverity.unshift({ path: [], severity: 0 });
      // Iterate across the nodes in each path and push that node to the path.
      for (var j = 0; j < paths[i].length; j++) {
          pathSeverity[0]["path"].push(paths[i][j]["id"]);
          // Add to the severity each of the valued weights.
          pathSeverity[0]["severity"] += paths[i][j]["value"];
      }
    }
    // Sort array in decreasing order by severity.
    pathSeverity.sort((a,b) => b.severity - a.severity)
    for (var i = 0; i < pathSeverity.length; i++) {
      pathSeverity[i]["name"] = "Scenario " + (i + 1)
      pathSeverity[i]["key"] = (i + 1)
    }
    return pathSeverity
  }

  /**
   * Calculates the paths for a tree and weights for each node.
   * @param {object} tree A tree.
   * @return {Array} The list of paths.
   */
  generatePaths(tree) {
    let paths = [];
    //base case; if a leaf node or root node by itself
    if (!("children" in tree)) {
      // Add an array to paths with the current node.
      paths.push([{ id: tree["ID"], value: this.calculateAverage(tree) }]);
      return paths;
    }
    //is a parent node
    else {
      // Get children from the current node.
      var children = tree["children"];
      // Iterate across children and generate paths.
      for (var i = 0; i < children.length; i++) {
        var result = this.generatePaths(children[i]);
        if (tree["operator"] === "OR") {
          // For each path in the result, add the current node id to the front of the path.
          for (var j = 0; j < result.length; j++) {
            //result[j].unshift(tree["ID"]);
            // Add resulting path to list of paths to return.
            paths.push(result[j]);
          }
        } else {
          //AND node
          if (paths.length > 0) {
            var newPaths = [];
            for (var j = 0; j < result.length; j++) {
              for (var k = 0; k < paths.length; k++) {
                var tempPaths = JSON.parse(JSON.stringify(paths));
                tempPaths[k].push(result[j]);
                newPaths.push(tempPaths[k].flat());
              }
            }
            // assign deep copy to path
            paths = JSON.parse(JSON.stringify(newPaths));
          } else {
            //asign deep copy to path
            paths = JSON.parse(JSON.stringify(result));
          }
          // Add resulting path to list of paths to return.
          //paths = paths.flat();
        }
      }
      // Iterate across paths and add current node id at front.
      for (var j = 0; j < paths.length; j++) {
        paths[j].unshift({ id: tree["ID"], value: 0 });
      }
      return paths;
    }
  }

  /**
   * Calculates the average for a given set of metrics.
   * @param {object} leaf the leaf node to calculate the average
   * @return {number} The number representing the average of the metrics.
   */
  calculateAverage(leaf) {
    var metrics = ["l", "v", "r", "t"];
    var weight = 0;
    // Counter for the number of metrics actually present.
    var num = 0;
    // Iterate across metrics list and check if present in leaf.
    for (var i = 0; i < metrics.length; i++) {
      if (metrics[i] in leaf) {
        // Add to the weight and increment the number of metrics.
        weight += leaf[metrics[i]];
        num++;
      }
    }
    // Return the weight if num is 0, otherwise return the average.
    return num === 0 ? weight : weight / num;
  }
}
