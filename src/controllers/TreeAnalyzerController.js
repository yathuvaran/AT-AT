import { attackPatterns } from "../assets/AttackPatterns";
export default class TreeAnalyzerController {
  /**
   * Analyzes a tree.
   * @param {object} tree A tree.
   * @return {Array} The list of paths.
   */
  analyzeTree(tree) {
    // Initialize empty path severity array.
    var pathSeverity = [];
    // Array to hold metric characters.
    var metrics = ["l", "v", "r", "t"];
    // Get the generated paths for a tree.
    var paths = this.generatePaths(tree);
    // Iterate across paths and add to the front of pathSeverity.
    // Creating an object with an empty id array and a 0 severity.
    for (var i = 0; i < paths.length; i++) {
      // Initialize object to hold 4 highest metrics for the path
      var highestMetrics = {};
      //Initialize object to hold specific mitigations
      var specificMitigations = {};

      pathSeverity.unshift({
        path: [],
        severity: 0,
        highestMetrics: {},
        l: -1,
        v: -1,
        r: -1,
        t: -1,
        tupledSeverity: "",
      });
      // Iterate across the nodes in each path and push that node to the path.
      for (var j = 0; j < paths[i].length; j++) {
        // Check if leaf first, if so, determine if it has highest metrics in path.
        if (paths[i][j]["metrics"]) {
          metrics.forEach((metric) => {
            if (
              !highestMetrics[metric] ||
              !highestMetrics[metric][0] ||
              highestMetrics[metric][0] < paths[i][j]["metrics"][metric]
            ) {
              highestMetrics[metric] = [
                paths[i][j]["metrics"][metric],
                paths[i][j]["name"],
              ];
            }
          });

          console.log(paths[i][j]["metrics"]);
          if (paths[i][j]["metrics"]["l"] !== undefined) {
            if (pathSeverity[0]["l"] == -1) {
              pathSeverity[0]["l"] = paths[i][j]["metrics"]["l"];
            } else {
              pathSeverity[0]["l"] *= paths[i][j]["metrics"]["l"];
            }
          }

          if (paths[i][j]["metrics"]["v"] !== undefined) {
            if (pathSeverity[0]["v"] == -1) {
              pathSeverity[0]["v"] = paths[i][j]["metrics"]["v"];
            } else {
              pathSeverity[0]["v"] *= paths[i][j]["metrics"]["v"];
            }
          }

          if (paths[i][j]["metrics"]["r"] !== undefined) {
            if (pathSeverity[0]["r"] == -1) {
              pathSeverity[0]["r"] = paths[i][j]["metrics"]["r"];
            } else {
              pathSeverity[0]["r"] *= paths[i][j]["metrics"]["r"];
            }
          }

          if (paths[i][j]["metrics"]["t"] !== undefined) {
            if (pathSeverity[0]["t"] == -1) {
              pathSeverity[0]["t"] = paths[i][j]["metrics"]["t"];
            } else {
              pathSeverity[0]["t"] *= paths[i][j]["metrics"]["t"];
            }
          }
        }

        // Add to the severity each of the valued weights.
        pathSeverity[0]["severity"] += paths[i][j]["value"];
        pathSeverity[0]["path"].push(paths[i][j]["id"]);

        // Loop over each specific recommendation and check if it's in the node name.
        for (const [key, value] of Object.entries(attackPatterns)) {
          if (paths[i][j]["name"].toLowerCase().includes(key.toLowerCase())) {
            specificMitigations[key] = value;
          }
        }
      }
      pathSeverity[0]["highestMetrics"] = highestMetrics;
      pathSeverity[0]["specificMitigations"] = specificMitigations;
    }
    // Sort array in decreasing order by severity.
    pathSeverity.sort((a, b) => b.severity - a.severity);
    for (var i = 0; i < pathSeverity.length; i++) {
      pathSeverity[i]["name"] = "Scenario " + (i + 1);
      pathSeverity[i]["key"] = i + 1;
    }
    for (var i = 0; i < pathSeverity.length; i++) {
      if (pathSeverity[i]["severity"] == 0) {
        pathSeverity[i]["severity"] = "N/A";
      }
      if (pathSeverity[i]["l"] == -1) {
        pathSeverity[i]["l"] = "N/A";
      }
      else {
        pathSeverity[i]["l"] = pathSeverity[i]["l"].toFixed(2)
      }
      if (pathSeverity[i]["v"] == -1) {
        pathSeverity[i]["v"] = "N/A";
      }
      else {
        pathSeverity[i]["v"] = pathSeverity[i]["v"].toFixed(2)
      }
      if (pathSeverity[i]["r"] == -1) {
        pathSeverity[i]["r"] = "N/A";
      }
      else {
        pathSeverity[i]["r"] = pathSeverity[i]["r"].toFixed(2)
      }
      if (pathSeverity[i]["t"] == -1) {
        pathSeverity[i]["t"] = "N/A";
      }
      else {
        pathSeverity[i]["t"] = pathSeverity[i]["t"].toFixed(2)
      }
      
    }
    console.log(pathSeverity);
    return pathSeverity;
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
      console.log(tree);
      paths.push([
        {
          id: tree["ID"],
          value: this.calculateAverage(tree),
          metrics: this.getMetrics(tree),
          name: tree["name"],
        },
      ]);
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
        console.log(paths);
        paths[j].unshift({ id: tree["ID"], value: 0, name: tree["name"] });
      }
      console.log(paths);
      return paths;
    }
  }

  getMetrics(tree) {
    return { l: tree["l"], v: tree["v"], r: tree["r"], t: tree["t"] };
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
