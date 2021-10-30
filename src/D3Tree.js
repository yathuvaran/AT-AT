import React from "react";
import Tree from "react-d3-tree";
class D3Tree extends React.Component {
  
  render() {
    return (
        <Tree orientation="vertical" data={this.props.data}></Tree>
    );
  }
}
export default D3Tree;
