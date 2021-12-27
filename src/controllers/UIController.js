import AttackTreeController from "./AttackTreeController";

export default class UIController {
  getInputtedDSL() {
    const attackTreeController = new AttackTreeController();
    attackTreeController.parseDSL(Window.map.getTextAreaValue());
  }

  getImportedDSL() {
    console.log(document.getElementById("ImportDSL"));
  }

  highlightTree(treeData, path) {
    // Create an empty stack and a variable for a node.
    // var stack = [], node;
    // // Begin by pushing root onto stack, the first node in treeData.
    // stack.push(treeData);
    // // Iterate while elements in stack.
    // while (stack.length > 0) {
    //   // Get current node from stack.
    //   node = stack.pop();
    //   // Check if node in path.
    //   if (path.includes(node["ID"])) {
    //     // Highlight it
    //     console.log('Colour', node["ID"])
    //   }
    //   // If node has children, iterate across and add them to stack.
    //   if ("children" in node) {
    //     for (var i = 0; i < node.children.length; i++) {
    //       stack.push(node.children[i]);
    //     }
    //   }
    // }

    if (path.includes(treeData["ID"])) {
        treeData["color"] = "red";
    }
    if (treeData.children !== undefined && treeData.children.length > 0) {
      for (var i = 0; i < treeData.children.length; i++) {
        treeData.children[i] = this.highlightTree(treeData.children[i], path);
      }
    }

    return treeData;
  }
}
