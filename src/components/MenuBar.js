import React, { useState, useEffect, Component } from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import "../App.css";
import "antd/dist/antd.css";
import "../index.css";
import { Menu, Upload, message, Modal, Button } from "antd";
import { Layout, Typography } from "antd";
const { Title } = Typography;
import { saveAs } from "file-saver";
import {
  UploadOutlined,
  SettingOutlined,
  DesktopOutlined,
  DownloadOutlined,
  FileOutlined,
} from "@ant-design/icons";
import UIController from "../controllers/UIController";
import { getByTestId } from "@testing-library/dom";
import D3Tree from "./D3Tree";
import RecommendationBox from "./RecommendationBox";

const uiController = new UIController();

const { SubMenu } = Menu;

class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      translate: 0,
    };
  }

  componentDidMount() {
    this.setState({translate: document.getElementsByClassName("rd3t-svg")[0].width.baseVal.value})
  }

  handleClick = (e) => {
    console.log(e);
    switch (e.key) {
      case "setting:4":
        Window.map.showRecommendations();
        var message = this.props.enableRecommendation
          ? "Recommendations Disabled"
          : "Recommendations Enabled";
        Window.map.openNotificationWithIcon("success", message, "");
        break;
      case "setting:2":
        this.toggleOpened();
        break;
      case "setting:3":
        Window.map.exportDSL();
        break;
    }
  };

  createReport() {
    const element = <div>{this.renderTrees()}</div>;
    console.log(ReactDOMServer.renderToString(element));
    var blob = new Blob([ReactDOMServer.renderToString(element)], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "Report.html");
  }

  toggleOpened = () => {
    this.setState(
      {
        opened: !this.state.opened
      },
      () => {
        this.setState({translate: document.getElementsByClassName("rd3t-svg")[0].width.baseVal.value})
      }
    )
  };

  handleSave = () => {
    document
      .getElementsByClassName("ant-modal-body")[0]
      .insertAdjacentHTML(
        "beforeend",
        "<style>.highlight_link{stroke:red !important;stroke-width: 3;stroke-opacity: 1;}</style>"
      );
    [document.getElementsByClassName("ant-modal-body")[0]];
    var blob = new Blob(
      [document.getElementsByClassName("ant-modal-body")[0].innerHTML],
      { type: "text/plain;charset=utf-8" }
    );
    console.log(document.getElementsByClassName("ant-modal-body")[0]);
    saveAs(blob, "Report.html");
  };

  handleCancel = () => {
    this.setState({ opened: false });
  };

  /**
   * Function to generate recommendations for report.
   */
  generateRecommendations(scenarioData) {
    // Local map for metrics to full names.
    var metrics = {
      l: "Likelihood",
      v: "Victim Impact",
      r: "Risk",
      t: "Time Difficulty Ratio",
    };
    // Define local variables to store rows and count for a unique key.
    var rows;
    var count = 2;
    // If data is defined.
    if (scenarioData) {
      // Create an empty array for rows.
      rows = [];
      // Iterate across metrics and check if value is defined.
      Object.keys(scenarioData["highestMetrics"]).forEach((metric) => {
        if (scenarioData["highestMetrics"][metric][0]) {
          // Push a recommendation to the rows array.
          rows.push(
            // Add a title element with the key being the count and the
            // formatted text of the node and metrics.
            <li>
              {'Node "' +
                scenarioData["highestMetrics"][metric][1] +
                '" with a ' +
                metrics[metric] +
                " of " +
                scenarioData["highestMetrics"][metric][0]}
            </li>
          );
          count++;
        }
      });
    }
    // Iterate across specific mitigation keys and add them as a header.
    Object.keys(scenarioData["specificMitigations"]).forEach((attack) => {
      rows.push(<h3>{attack}</h3>);
      // Iterate across each attack mitigation and add it to the list.
      for (
        var i = 0;
        i < scenarioData["specificMitigations"][attack].length;
        i++
      ) {
        console.log(scenarioData["specificMitigations"][attack][i]);
        rows.push(
          <li>
            <a
              key={"Mitigation" + i}
              href={scenarioData["specificMitigations"][attack][i]["Link"]}
              target="_blank"
            >
              {scenarioData["specificMitigations"][attack][i]["Mitigation"]}
            </a>
          </li>
        );
      }
    });
    return rows;
  }

  renderTrees() {
    var trees = [];
    if (this.props.scenarioData) {
      for (var i = 0; i < this.props.scenarioData.length; i++) {
        trees.push(
          <div key={i}>
            <h1>{this.props.scenarioData[i].name}</h1>
            <D3Tree
              reportGen={true}
              translate={this.state.translate}
              data={uiController.highlightTree(
                JSON.parse(JSON.stringify(this.props.originalTree)),
                this.props.scenarioData[i].path
              )}
            ></D3Tree>
            <Title key={0} level={2}>
              Recommendations for {this.props.scenarioData[i].name}
            </Title>
            <Title key={1} level={3}>
              Highest Metrics to be Mitigated:
            </Title>
            {this.generateRecommendations(this.props.scenarioData[i])}
          </div>
        );
      }
    }
    return trees;
  }

  fixSizing(){
    var treeContainers = document.getElementsByClassName("treeContainer");
    for (var i = 0; i < treeContainers.length; i++){
      treeContainers[i].style.height = document.getElementsByClassName("rd3t-svg")[0].height.baseVal.value
    }
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
      <div>
        <Menu
          selectable={false}
          onClick={this.handleClick}
          //selectedKeys={[current]}
          mode="horizontal"
        >
          <SubMenu key="SubMenu1" icon={<SettingOutlined />} title="File">
            <Menu.Item key="setting:1" icon={<UploadOutlined />}>
              <Upload
                key="upload"
                accept=".txt"
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
            <Menu.Item key="setting:2" icon={<FileOutlined />}>
              Generate Report
            </Menu.Item>
            <Menu.Item key="setting:3" icon={<DownloadOutlined />}>
              Export DSL
            </Menu.Item>
          </SubMenu>
          <SubMenu key="SubMenu2" icon={<DesktopOutlined />} title="View">
            {this.props.enableRecommendation ? (
              <Menu.Item key="setting:4">Disable Recommendations</Menu.Item>
            ) : (
              <Menu.Item key="setting:4">Enable Recommendations</Menu.Item>
            )}
          </SubMenu>
        </Menu>
        <Modal
          title={
            <div>
              <h1>Report Preview</h1>
              <Button onClick={this.handleCancel}>Cancel</Button>
              <Button onClick={this.handleSave}>Save Report</Button>
            </div>
          }
          closable={false}
          visible={opened}
          key="modal"
          footer={null}
          width="320"
        >
          <h1>Original Tree</h1>
          <D3Tree
            key="og"
            data={this.props.originalTree ? this.props.originalTree : {}}
            reportGen={true}
            translate={this.state.translate}
          ></D3Tree>
          {this.renderTrees()}
        </Modal>
        {this.fixSizing()}
      </div>
    );
  }
}

export default MenuBar;
