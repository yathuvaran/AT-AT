import React from "react";
import Tree from "react-d3-tree";
class D3Tree extends React.Component {
  render() {
    return (
      <Tree
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
        orientation="vertical"
        data={this.props.data}
      ></Tree>
    );
  }
}
export default D3Tree;
