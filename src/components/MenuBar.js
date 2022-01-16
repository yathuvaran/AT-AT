import React, { Component } from "react";
//import ReactDOM from "react-dom";
import "../App.css";
import "antd/dist/antd.css";
import "../index.css";
import { Menu, Upload, message, Button } from "antd";
import {
  UploadOutlined,
  SettingOutlined,
  DesktopOutlined,
  FilePdfOutlined,
  FileOutlined,
} from "@ant-design/icons";
import UIController from "../controllers/UIController";
import { getByTestId } from "@testing-library/dom";

const uiController = new UIController();

const { SubMenu } = Menu;

class MenuBar extends Component {
  handleClick = (e) => {
    console.log("click ", e);
    switch (e.key) {
      case "setting:4":
        Window.map.showRecommendations();
        var message = this.props.enableRecommendation ? "Recommendations Disabled" : "Recommendations Enabled"
        Window.map.openNotificationWithIcon(
          "success",
          message,
          ""
        );
    }
  };

  render() {
    //const { current } = this.state;
    return (
      <Menu
        selectable={false}
        onClick={this.handleClick}
        //selectedKeys={[current]}
        mode="horizontal"
      >
        <SubMenu key="SubMenu1" icon={<SettingOutlined />} title="File">
          <Menu.Item key="setting:1" icon={<UploadOutlined />}>
            <Upload id="ImportDSL" onChange={uiController.getImportedDSL}>
              Import DSL
            </Upload>
          </Menu.Item>
          <Menu.Item key="setting:2" icon={<FilePdfOutlined />}>
            Export PDF
          </Menu.Item>
          <Menu.Item key="setting:3" icon={<FileOutlined />}>
            Export HTML
          </Menu.Item>
        </SubMenu>
        <SubMenu key="SubMenu2" icon={<DesktopOutlined />} title="View">
          {this.props.enableRecommendation ? <Menu.Item key="setting:4">Disable Recommendations</Menu.Item> : <Menu.Item key="setting:4">Enable Recommendations</Menu.Item>}
        </SubMenu>
      </Menu>
    );
  }
}

export default MenuBar;
