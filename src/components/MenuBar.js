import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import "../App.css";
import "antd/dist/antd.css";
import "../index.css";
import { Menu, Upload, message, Modal, Button } from "antd";
import {
  UploadOutlined,
  SettingOutlined,
  DesktopOutlined,
  FilePdfOutlined,
  FileOutlined,
} from "@ant-design/icons";
import UIController from "../controllers/UIController";
import { getByTestId } from "@testing-library/dom";
import D3Tree from "./D3Tree";

const uiController = new UIController();

const { SubMenu } = Menu;

class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
    };
  }
  handleClick = (e) => {
    switch (e.key) {
      case "setting:4":
        Window.map.showRecommendations();
        var message = this.props.enableRecommendation
          ? "Recommendations Disabled"
          : "Recommendations Enabled";
        Window.map.openNotificationWithIcon("success", message, "");
      case "setting:3":
    }
  };

  toggleOpened = () => {
    this.setState({ opened: !this.state.opened });
  };

  handleOk = () => {
    document
      .getElementsByClassName("ant-modal-body")[0]
      .insertAdjacentHTML(
        "beforeend",
        "<style>.highlight_link{stroke:red !important;stroke-width: 3;stroke-opacity: 1;}</style>"
      );
    //this.copyStyles(document.getElementsByTagName('head')[0], document.getElementsByClassName('ant-modal-body')[0])
    // var style_elems = document.getElementsByTagName('style')
    // for (var i = 0; i < style_elems.length; i++){
    //   document.getElementsByClassName('ant-modal-body')[0].appendChild(style_elems[i])
    // }
  };

  handleCancel = () => {
    this.setState({ opened: false });
  };

  copyStyles(source, target) {
    // Store style tags, avoid reflow in the loop
    const headFrag = target;
    console.log(source.styleSheets);
    Array.from(document.styleSheets).forEach((styleSheet) => {
      // For <style> elements
      let rules;
      try {
        rules = styleSheet.cssRules;
      } catch (err) {
        console.error(err);
      }
      if (rules) {
        // IE11 is very slow for appendChild, so use plain string here
        const ruleText = [];

        // Write the text of each rule into the body of the style element
        Array.from(styleSheet.cssRules).forEach((cssRule) => {
          const { type } = cssRule;

          // Skip unknown rules
          if (type === CSSRule.UNKNOWN_RULE) {
            return;
          }

          let returnText = "";

          if (type === CSSRule.KEYFRAMES_RULE) {
            // IE11 will throw error when trying to access cssText property, so we
            // need to assemble them
            returnText = getKeyFrameText(cssRule);
          } else if (
            [CSSRule.IMPORT_RULE, CSSRule.FONT_FACE_RULE].includes(type)
          ) {
            // Check if the cssRule type is CSSImportRule (3) or CSSFontFaceRule (5)
            // to handle local imports on a about:blank page
            // '/custom.css' turns to 'http://my-site.com/custom.css'
            returnText = fixUrlForRule(cssRule);
          } else {
            returnText = cssRule.cssText;
          }
          ruleText.push(returnText);
        });

        const newStyleEl = document.createElement("style");
        newStyleEl.textContent = ruleText.join("\n");
        headFrag.appendChild(newStyleEl);
      } else if (styleSheet.href) {
        // for <link> elements loading CSS from a URL
        const newLinkEl = document.createElement("link");

        newLinkEl.rel = "stylesheet";
        newLinkEl.href = styleSheet.href;
        headFrag.appendChild(newLinkEl);
      }
    });

    //target.head.appendChild(headFrag)
  }

  renderTrees() {
    var trees = [];
    console.log(this.props.scenarioData);
    for (var i = 0; i < this.props.scenarioData.length; i++) {
      trees.push(
        <div>
          <h1>{this.props.scenarioData[i].name}</h1>
          <D3Tree
            data={uiController.highlightTree(
              JSON.parse(JSON.stringify(this.props.originalTree)),
              this.props.scenarioData[i].path
            )}
          ></D3Tree>
        </div>
      );
    }
    return trees;
  }

  fixHighlighting() {
    var test = document.getElementsByClassName("ant-modal-body")[1];
    if (test != null) {
      var highlight_links = test.getElementsByClassName("highlight_link");
      var svg_nodes = test.getElementsByClassName("rd3t-node");
      if (svg_nodes[0]) {
        const parent = svg_nodes[0].parentNode;
        for (var i = 0; i < highlight_links.length; i++) {
          parent.appendChild(highlight_links[0]);
        }
        for (var i = 0; i < svg_nodes.length; i++) {
          parent.appendChild(svg_nodes[0]);
        }
      }
    }
  }

  render() {
    const { opened, count } = this.state;
    return (
      <Menu
        selectable={false}
        onClick={this.handleClick}
        //selectedKeys={[current]}
        mode="horizontal"
      >
        <SubMenu key="SubMenu1" icon={<SettingOutlined />} title="File">
          <Menu.Item key="setting:1" icon={<UploadOutlined />}>
            <Upload
              accept=".txt, .csv"
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader();

                reader.onload = (e) => {
                  uiController.getImportedDSL(e.target.result);
                };
                reader.readAsText(file);
                // Prevent upload
                return false;
              }}
            >
              <Button>Import DSL</Button>
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
          {this.props.enableRecommendation ? (
            <Menu.Item key="setting:4">Disable Recommendations</Menu.Item>
          ) : (
            <Menu.Item key="setting:4">Enable Recommendations</Menu.Item>
          )}
        </SubMenu>
        <Button onClick={this.toggleOpened}>Open</Button>
        <Modal
          title="Basic Modal"
          visible={opened}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <h1>Original Tree</h1>
          <D3Tree
            data={this.props.originalTree ? this.props.originalTree : {}}
          ></D3Tree>
          {this.renderTrees()}
        </Modal>
        {this.fixHighlighting()}
      </Menu>
    );
  }
}

function getKeyFrameText(cssRule) {
  const tokens = ["@keyframes", cssRule.name, "{"];
  Array.from(cssRule.cssRules).forEach((cssRule) => {
    // type === CSSRule.KEYFRAME_RULE should always be true
    tokens.push(cssRule.keyText, "{", cssRule.style.cssText, "}");
  });
  tokens.push("}");
  return tokens.join(" ");
}

function fixUrlForRule(cssRule) {
  return cssRule.cssText
    .split("url(")
    .map((line) => {
      if (line[1] === "/") {
        return `${line.slice(0, 1)}${window.location.origin}${line.slice(1)}`;
      }
      return line;
    })
    .join("url(");
}

export default MenuBar;
