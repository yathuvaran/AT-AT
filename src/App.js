import React from "react";
import { Tabs, Layout, Input, Button } from "antd";
import "antd/dist/antd.css";
import UIController from "./controllers/UIController";
import Tree from "react-d3-tree";
import ReactDOM from "react-dom";

const { TabPane } = Tabs;
const { Header, Footer, Sider, Content } = Layout;
const { TextArea } = Input;
const uiController = new UIController();

var currentPanes = [
  { title: "New Tab 0", content: { tree: {}, dsl: "" }, key: "0", closable: false },
];

var tree_data = {
  name: "openSafe",
  operator: "OR",
  children: [
    {
      name: "ForceOpen",
      operator: "OR",
      children: [
        { name: "Dynamite", r: 0, t: 0.1 },
        { name: "Throw Out Window" },
      ],
    },
    {
      name: "Pick Lock",
      operator: "AND",
      children: [
        { name: "Insert Bobby Pin", l: 0.9, v: 0.3 },
        { name: "Pick With Bobby Pin", l: 0.8 },
      ],
    },
  ],
};

class App extends React.Component {
  newTabIndex = 1;
  currentIndex = currentPanes[0].key;
  constructor(props) {
    super(props);
    this.state = {
      activeKey: currentPanes[0].key,
      panes: currentPanes,
      TextArea: "",
      treeData: {name: ''},
    };
    this.handleChange = this.handleChange.bind(this);
  }

  onChange = (activeKey) => {
     console.log('heelo') 
    //save everything associated with current index to intitalPanes
    for (var i = 0; i < currentPanes.length; i++) {
      console.log("indexKey: ", currentPanes[i].key);
      console.log("currentIndex: ", this.currentIndex);
      if (currentPanes[i].key === this.currentIndex) {
        currentPanes[i]["content"]["tree"] = tree_data;
        currentPanes[i]["content"]["dsl"] =
          document.getElementById("DSLTextBox").value;
      }
    }
    //active key is our target key
    this.currentIndex = activeKey;
    console.log(currentPanes);
    var activeKeyIndex = 0
    for(i = 0; i < currentPanes.length; i++){
        if (currentPanes[i].key === activeKey){
            activeKeyIndex = i
        }
    }

    //destroy tree
    while (ReactDOM.unmountComponentAtNode(document.getElementById("tree"))) {
      console.log("testy");
    }

    


    this.setState({ activeKey, TextArea: currentPanes[activeKeyIndex].content.dsl });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    console.log('cheese')
    const { panes } = this.state;
    const activeKey = `${this.newTabIndex++}`;
    const newPanes = [...panes];
    newPanes.push({
      title: "New Tab " + activeKey,
      content: "Content of new Tab",
      key: activeKey,
    });
    currentPanes.push({
      title: "New Tab" + activeKey,
      content: { tree: {name: ''}, dsl: "" },
      key: activeKey,
    });
    for (var i = 0; i < newPanes.length; i++) {
      newPanes[i].closable = true;
    }
    this.setState({
      panes: newPanes,
      activeKey,
    });
    this.onChange(activeKey)
  };

  remove = (targetKey) => {
    const { panes, activeKey } = this.state;
    let newActiveKey = activeKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    this.onChange(newActiveKey)

    console.log("target", targetKey);
    currentPanes = currentPanes.filter((pane) => pane.key !== targetKey);
    //const currentPanes = panes.filter((pane) => pane.key !== targetKey);
    // if (currentPanes.length && newActiveKey === targetKey) {
    //   if (lastIndex >= 0) {
    //     newActiveKey = currentPanes[lastIndex].key;
    //   } else {
    //     newActiveKey = currentPanes[0].key;
    //   }
    // }
    var activeKeyIndex = 0
    for(var i = 0; i < currentPanes.length; i++){
        if (currentPanes[i].key === activeKey){
            activeKeyIndex = i
        }
    }
    console.log("newActiveKey", newActiveKey);
    console.log(currentPanes);
    
    this.setState({
      panes: newPanes,
      activeKey: newActiveKey,
    });
    if (currentPanes.length === 1) {
      newPanes[0].closable = false;
    }
  };

  handleChange(event) {
    this.setState({ TextArea: event.target.value });
  }

  treeChange(event){
    this.setState({treeData: event.target.data})
  }

  render() {
    const { panes, activeKey } = this.state;
    return (
      <div>
        <Tabs
          type="editable-card"
          onChange={this.onChange}
          activeKey={activeKey}
          onEdit={this.onEdit}
        >
          {panes.map((pane) => (
            <TabPane
              tab={pane.title}
              key={pane.key}
              closable={pane.closable}
            ></TabPane>
          ))}
        </Tabs>
        <Layout>
          <Sider width={350}>
            <TextArea
              value={this.state.TextArea}
              onChange={this.handleChange}
              id="DSLTextBox"
              rows={25}
            />
            <Button onClick={uiController.getInputtedDSL}>Generate</Button>
          </Sider>
          <Content id='tree'>
            <Tree onChange={this.treeChange} orientation="vertical" data={{name: ''}} />
          </Content>
        </Layout>
      </div>
    );
  }
}

export default App;
