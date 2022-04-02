import AttackTreeController from "./AttackTreeController";

export default class UIController {
  getInputtedDSL() {
    const attackTreeController = new AttackTreeController();
    attackTreeController.parseDSL(Window.map.getTextAreaValue());
  }

  getImportedDSL(text) {
    Window.map.setTextAreaValue(text);
  }

  highlightTree(treeData, path) {
    if (path.includes(treeData["ID"])) {
      treeData["highlight"] = true;
    }
    if (treeData.children !== undefined && treeData.children.length > 0) {
      for (var i = 0; i < treeData.children.length; i++) {
        treeData.children[i] = this.highlightTree(treeData.children[i], path);
      }
    }
    return JSON.parse(JSON.stringify(treeData));
  }
}
