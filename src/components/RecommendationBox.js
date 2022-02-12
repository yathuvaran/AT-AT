import React from "react";
import { Layout, Typography } from "antd";
const { Sider, Content, Footer } = Layout;
const { Title } = Typography;
class RecommendationBox extends React.Component {
  componentDidMount() {
    if (document.getElementById("recommendation_box")) {
      document.getElementById("recommendation_box").style.width =
        window.innerWidth -
        document.getElementById("code_sider").offsetWidth.toString() +
        "px";
    }
  }
  /**
   * Generate recommendations for data.
   * @return {Array} An array of recommendations.
   */
  generateRecommendations() {
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
    if (this.props.data) {
      // Create an empty array for rows.
      rows = [];
      // Iterate across metrics and check if value is defined.
      Object.keys(this.props.data["highestMetrics"]).forEach((metric) => {
        if (this.props.data["highestMetrics"][metric][0]) {
          // Push a recommendation to the rows array.
          rows.push(
            // Add a title element with the key being the count and the
            // formatted text of the node and metrics.
            <li>
              {'Node "' +
                this.props.data["highestMetrics"][metric][1] +
                '" with a ' +
                metrics[metric] +
                " of " +
                this.props.data["highestMetrics"][metric][0]}
            </li>
          );
          count++;
        }
      });
    }
    // Iterate across specific mitigation keys and add them as a header.
    Object.keys(this.props.data["specificMitigations"]).forEach((attack) => {
      rows.push(
        <h3>{attack}</h3>
      )
      // Iterate across each attack mitigation and add it to the list.
      for (var i = 0; i < this.props.data["specificMitigations"][attack].length; i++) {
        console.log(this.props.data["specificMitigations"][attack][i])
        rows.push(
          <li><a key={"Mitigation" + i} href={this.props.data["specificMitigations"][attack][i]["Link"]} target="_blank">
            {this.props.data["specificMitigations"][attack][i]["Mitigation"]}
          </a></li>
        );
      }
    });
    return rows;
  }
  /**
   * Render the recommendation box.
   * @return {Element} A div element containing the recommendation box.
   */
  render() {
    if (document.getElementById("recommendation_box")) {
      document.getElementById("recommendation_box").style.width =
        window.innerWidth -
        document.getElementById("code_sider").offsetWidth.toString() +
        "px";
    }
    if (
      Object.keys(this.props.data).length === 0 &&
      this.props.data.constructor === Object
    ) {
      return <div></div>;
    }
    return (
      <div id="recommendation_box">
        <h1>
          Recommendations for {this.props.data.name}
        </h1>
        <h2>
          Highest Metrics to be Mitigated:
        </h2>
        {this.generateRecommendations()}
      </div>
    );
  }
}
export default RecommendationBox;
