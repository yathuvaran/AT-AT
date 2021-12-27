import AttackTreeController from "./AttackTreeController";

export default class UIController {
  
  getInputtedDSL() {
    const attackTreeController = new AttackTreeController();
    attackTreeController.parseDSL(
      Window.map.getTextAreaValue()
    );
  }

  getImportedDSL() {
    console.log(document.getElementById("ImportDSL"));
  }

  highlightTree(treeData, selectedScenario) {
    treeData = treeData[0]
    Object.entries(jsonObj).forEach(([key, value])) => {

    }

  }
}
