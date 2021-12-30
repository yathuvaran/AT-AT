import React from "react";
import Tree from "react-d3-tree";
import AND from "./assets/AND.png";
import AND_RED from "./assets/AND_RED.png";
import OR from "./assets/OR.png";
import OR_RED from "./assets/OR_RED.png";

const nodeSize = { x: 100, y: 150 };

const foreignObjectProps = {
  width: nodeSize.x,
  height: nodeSize.y - 40,
  x: -50,
  y: -55,
};

class D3Tree extends React.Component {
  renderHighlightedLeaf(nodeDatum, toggleNode) {
    return (
      <g>
        <rect width="20" height="20" x="-10" onClick={toggleNode} fill="red" />
        <text fill="black" strokeWidth="1" x="20">
          {nodeDatum.name}
        </text>
      </g>
    );
  }

  renderLeaf(nodeDatum, toggleNode) {
    return (
      <g>
        <rect width="20" height="20" x="-10" onClick={toggleNode} />
        <text fill="black" strokeWidth="1" x="20">
          {nodeDatum.name}
        </text>
      </g>
    );
  }

  renderHighlightedOrNode(nodeDatum, toggleNode, foreignObjectProps) {
    return (
      <g onClick={toggleNode}>
        <foreignObject {...foreignObjectProps}>
          <div
            style={{
              backgroundColor: "#f0f2f5",
            }}
          >
            <img
              src={OR_RED}
              alt="or_red"
              style={{
                height: 50,
                position: "absolute",
                zIndex: 10,
                top: 5,
                left: 27,
                backgroundColor: "#f0f2f5",
              }}
            />
            <div
              style={{
                textAlign: "center",
                marginTop: 55,
                fontWeight: "bold",
                zIndex: 12,
                backgroundColor: "#f0f2f5"
              }}
            >
              {nodeDatum.name}
            </div>
          </div>
        </foreignObject>
      </g>
    );
  }

  renderOrNode(nodeDatum, toggleNode, foreignObjectProps) {
    return (
      <g onClick={toggleNode}>
        <foreignObject {...foreignObjectProps}>
          <div
            style={{
              backgroundColor: "#f0f2f5",
            }}
          >
            <img
              src={OR}
              alt="or"
              style={{
                height: 50,
                position: "absolute",
                zIndex: 10,
                top: 5,
                left: 27,
                backgroundColor: "#f0f2f5",
              }}
            />
            <div
              style={{
                textAlign: "center",
                marginTop: 55,
                fontWeight: "bold",
                zIndex: 12,
                backgroundColor: "#f0f2f5"
              }}
            >
              {nodeDatum.name}
            </div>
          </div>
        </foreignObject>
      </g>
    );
  }

  renderHighlightedAndNode(nodeDatum, toggleNode, foreignObjectProps) {
    return (
      <g onClick={toggleNode}>
        <foreignObject {...foreignObjectProps}>
          <div
            style={{
              backgroundColor: "#f0f2f5",
            }}
          >
            <img
              src={AND_RED}
              alt="and_red"
              style={{
                height: 50,
                position: "absolute",
                zIndex: 10,
                top: 5,
                left: 25,
                backgroundColor: "#f0f2f5",
              }}
            />
            <div
              style={{
                textAlign: "center",
                marginTop: 55,
                fontWeight: "bold",
                zIndex: 11,
                backgroundColor: "#f0f2f5",
              }}
            >
              {nodeDatum.name}
            </div>
          </div>
        </foreignObject>
      </g>
    );
  }

  renderAndNode(nodeDatum, toggleNode, foreignObjectProps) {
    return (
      <g onClick={toggleNode}>
        <foreignObject {...foreignObjectProps}>
          <div
            style={{
              backgroundColor: "#f0f2f5",
            }}
          >
            <img
              src={AND}
              alt="and"
              style={{
                height: 50,
                position: "absolute",
                zIndex: 10,
                top: 5,
                left: 25,
                backgroundColor: "#f0f2f5",
              }}
            />
            <div
              style={{
                textAlign: "center",
                marginTop: 55,
                fontWeight: "bold",
                zIndex: 12,
                backgroundColor: "#f0f2f5"
              }}
            >
              {nodeDatum.name}
            </div>
          </div>
        </foreignObject>
      </g>
    );
  }

  renderSvgNode = ({ nodeDatum, toggleNode, foreignObjectProps }) => {
    if (nodeDatum["highlight"]) {
      switch (nodeDatum["operator"]) {
        case "OR":
          return this.renderHighlightedOrNode(
            nodeDatum,
            toggleNode,
            foreignObjectProps
          );
        case "AND":
          return this.renderHighlightedAndNode(
            nodeDatum,
            toggleNode,
            foreignObjectProps
          );
        default:
          return this.renderHighlightedLeaf(nodeDatum, toggleNode);
      }
    } else {
      switch (nodeDatum["operator"]) {
        case "OR":
          return this.renderOrNode(nodeDatum, toggleNode, foreignObjectProps);
        case "AND":
          return this.renderAndNode(nodeDatum, toggleNode, foreignObjectProps);
        default:
          return this.renderLeaf(nodeDatum, toggleNode);
      }
    }
  };

  getDynamicPathClass = ({ source, target }, orientation) => {
    if (target["data"]["highlight"]) {
      // Target node has no children -> this link leads to a leaf node.
      return "highlight_link";
    } else {
      return "default_link";
    }
  };
  render() {
    return (
      <Tree
        orientation="vertical"
        data={this.props.data}
        translate={{ x: 600, y: 200 }}
        renderCustomNodeElement={(rd3tProps) =>
          this.renderSvgNode({ ...rd3tProps, foreignObjectProps })
        }
        pathClassFunc={this.getDynamicPathClass}
        pathFunc="step"
      ></Tree>
    );
  }
}
export default D3Tree;
