import React from "react";
import ReactDOM from "react-dom";
import logo from "./logo.svg";
import "antd/dist/antd.css";
import "./index.css";
import { Tabs, Layout, Input, List, Button } from "antd";
import MenuBar from "./containers/MenuBar";
import UIController from "./controllers/UIController";
import { blue } from "@ant-design/colors";

const testy = new UIController();
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
  { title: "Tab 1", content: "Content of Tab 1", key: "1" },
  { title: "Tab 2", content: "Content of Tab 2", key: "2" },
  {
    title: "Tab 3",
    content: "Content of Tab 3",
    key: "3",
    closable: false,
  },
];

class App extends React.Component {
  newTabIndex = 0;

  state = {
    activeKey: initialPanes[0].key,
    panes: initialPanes,
  };

  onChange = (activeKey) => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    const newPanes = [...panes];
    newPanes.push({
      title: "New Tab",
      content: "Content of new Tab",
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
                  {pane.content}
                </TabPane>
              ))}
            </Tabs>
          </Header>
          <Layout>
            <Sider width={350}>
              <TextArea id="DSLTextBox" rows={25} />
              <Button onClick={testy.getInputtedDSL}>Generate</Button>
            </Sider>
            <Content>Tree</Content>
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
