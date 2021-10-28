import React from "react";
import ReactDOM from "react-dom";
import logo from "./logo.svg";
import "antd/dist/antd.css";
import "./index.css";
import { Tabs, Layout, Input, List, Button } from "antd";
import MenuBar from "./containers/MenuBar";
import UIController from "./controllers/UIController";
import { blue } from "@ant-design/colors";
import * as d3 from "d3";
import Tree from "react-d3-tree";

const tree_data = {
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
const uiController = new UIController();
const { Header, Footer, Sider, Content } = Layout;
const { TextArea } = Input;

const { TabPane } = Tabs;

const data = [
  "Scenario 1",
  "Scenario 2",
  "Scenario 3",
  "Scenario 4",
  "Scenario 5",
  "Scenario 6",
];

const initialPanes = [
  { title: "Tree 1", content: {}, key: 0},
];

class App extends React.Component {
  newTabIndex = 1;
  currentIndex = initialPanes[0].key

  state = {
    activeKey: initialPanes[0].key,
    panes: initialPanes,
  };

  onClick = (activeKey) => {
    console.log(this.currentIndex)
  }

  onChange = (activeKey) => {
    console.log(this.currentIndex, activeKey)
    //save everything associated with current index to intitalPanes
    this.currentIndex = activeKey
    this.setState({ activeKey });
    console.log(this.currentIndex, activeKey)
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { panes } = this.state;
    const activeKey = this.newTabIndex++;
    const newPanes = [...panes];
    newPanes.push({
      title: "New Tab",
      content: {},
      key: activeKey,
    });
    initialPanes.push({
      title: "New Tab",
      content: {},
      key: activeKey,
    });
    this.setState({
      panes: newPanes,
      activeKey,
    });
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
    this.setState({
      panes: newPanes,
      activeKey: newActiveKey,
    });
  };

  render() {
    const { panes, activeKey } = this.state;
    return (
      <div>
        <Layout>
          <MenuBar></MenuBar>
          <Header>
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
                >
                </TabPane>
              ))}
            </Tabs>
          </Header>
          <Layout>
            <Sider width={350}>
              <TextArea id="DSLTextBox" rows={25} />
              <Button onClick={uiController.getInputtedDSL}>Generate</Button>
            </Sider>
            <Content className="tree-container">
              <Tree orientation="vertical" data={tree_data} />
            </Content>
            <Sider style={{ backgroundColor: blue[2] }}>
              <List
                header={<div>Header</div>}
                footer={<div>Footer</div>}
                bordered
                dataSource={data}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Sider>
          </Layout>
          <Footer>Footer</Footer>
        </Layout>
      </div>
    );
  }
}

export default App;
