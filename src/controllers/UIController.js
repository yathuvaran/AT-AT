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
}
