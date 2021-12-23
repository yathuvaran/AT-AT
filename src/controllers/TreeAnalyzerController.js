export default class TreeAnalyzerController {
    /**
   * Calculates the paths for a tree.
   * @param {object} tree A tree .
   * @return {Array} The list of paths.
   */
  generatePaths(tree) {
    let paths = []
    //base case; if a leaf node or root node by itself
    if (!("children" in tree)){
        paths.push(tree["ID"])
        console.log(paths)
        return paths;
    }
    //is a parent node
    else {
        var children = tree["children"]
        
        for (var i = 0; i < children.length; i++){
      
            paths.push(this.generatePaths(children[i]))
        }
        for (var i = 0; i < paths.length; i++){
            paths[i].unshift(tree["ID"])
        }
        console.log(paths)
        return paths;
    }
  }
}