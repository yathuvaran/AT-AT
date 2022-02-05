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
            <Title key={count} level={4}>
              {'Node "' +
                this.props.data["highestMetrics"][metric][1] +
                '" with a ' +
                metrics[metric] +
                " of " +
                this.props.data["highestMetrics"][metric][0]}
            </Title>
          );
          count++;
        }
      });
    }
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
        <Title key={0} level={2}>
          Recommendations for {this.props.data.name}
        </Title>
        <Title key={1} level={3}>
          Highest Metrics to be Mitigated:
        </Title>
        {this.generateRecommendations()}
      </div>
    );
  }
}
export default RecommendationBox;
