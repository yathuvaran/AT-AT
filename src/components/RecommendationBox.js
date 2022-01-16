import React from "react";
import { Layout, Typography } from "antd";
const { Sider, Content, Footer } = Layout;
const { Title } = Typography;
class RecommendationBox extends React.Component {
  /**
   * Generate recommendations for data.
   * @return {Array} An array of recommendations.
   */
  generateRecommendations() {
    console.log(this.props.data["highestMetrics"]);
    // Local map for metrics to full names.
    var metrics = {"l":"Likelihood", "v":"Victim Impact", "r": "Risk", "t":"Time Difficulty Ratio"}
    // If data is defined.
    var rows;
    if (this.props.data) {
      // Create an empty array for rows.
      rows = [];
      // Iterate across metrics and check if value is defined.
      Object.keys(this.props.data["highestMetrics"]).forEach((metric) => {
        if (this.props.data["highestMetrics"][metric][0]) {
          // Push a recommendation to the rows array.
          rows.push(
            <Title level={4}>
              {"Node \"" + this.props.data["highestMetrics"][metric][1] + "\" with a " + metrics[metric] +
                " of " +
                this.props.data["highestMetrics"][metric][0]}
            </Title>
          );
        }
      });
    }
    return rows;
  }

  render() {
    return (
      <div id="recommendation_box">
        <Title level={2}>Recommendations for {this.props.data.name}</Title>
        <Title level={3}>Highest Metrics to be Mitigated:</Title>
        {Object.keys(this.props.data).length === 0 && this.props.data.constructor === Object ? "empty" : this.generateRecommendations()}
      </div>
    );
  }
}
export default RecommendationBox;
