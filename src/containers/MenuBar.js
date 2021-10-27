import React, { Component } from "react";
//import ReactDOM from "react-dom";
import "../App.css";
import "antd/dist/antd.css";
import "../index.css";
import { Menu, Upload, message, Button } from "antd";
import { UploadOutlined, SettingOutlined } from "@ant-design/icons";
import UIController from "../controllers/UIController";
import { getByTestId } from "@testing-library/dom";

const testy = new UIController();

const { SubMenu } = Menu;

class MenuBar extends Component {
  render() {
    //const { current } = this.state;
    return (
      <Menu
        onClick={this.handleClick}
        //selectedKeys={[current]}
        mode="horizontal"
      >
        <SubMenu key="SubMenu1" icon={<SettingOutlined />} title="File">
          <Menu.Item key="setting:1">
            <Upload id="ImportDSL" onChange={testy.getImportedDSL}>
            Import DSL
            </Upload>
          </Menu.Item>
          <Menu.Item key="setting:2">Export PDF</Menu.Item>
          <Menu.Item key="setting:3">Export HTML</Menu.Item>
        </SubMenu>
        <SubMenu key="SubMenu2" icon={<SettingOutlined />} title="View">
          <Menu.Item key="setting:4">Enable Recommendations</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}

export default MenuBar;
