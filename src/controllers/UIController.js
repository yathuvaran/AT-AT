import AttackTreeController from "./AttackTreeController";

export default class UIController {
  
  getInputtedDSL() {
    const attackTreeController = new AttackTreeController();
    attackTreeController.parseDSL(
      document.getElementById("DSLTextBox").value
    );
  }

  getImportedDSL() {
    console.log(document.getElementById("ImportDSL"));
  }
}
