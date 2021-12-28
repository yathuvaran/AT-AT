import React from "react";
import Tree from "react-d3-tree";
class D3Tree extends React.Component {
  renderSvgNode = ({ nodeDatum, toggleNode }) =>
    nodeDatum["highlight"] ? (
      <g>
        <rect width="20" height="20" x="-10" onClick={toggleNode} fill="red" />
        <text fill="black" strokeWidth="1" x="20">
          {nodeDatum.name}
        </text>
      </g>
    ) : (
      <g>
        <rect width="20" height="20" x="-10" onClick={toggleNode} />
        <text fill="black" strokeWidth="1" x="20">
          {nodeDatum.name}
        </text>
      </g>
    );

  getDynamicPathClass = ({ source, target }, orientation) => {
    console.log('target', target)
    if (target["data"]["highlight"]) {
      // Target node has no children -> this link leads to a leaf node.
      return "highlight_link";
    }
  };
  render() {
    return (
      <Tree
        orientation="vertical"
        data={this.props.data}
        translate={{ x: 600, y: 200 }}
        renderCustomNodeElement={this.renderSvgNode}
        pathClassFunc={this.getDynamicPathClass}
      ></Tree>
    );
  }
}
export default D3Tree;
