import React, { useRef } from "react";
import NewWindow from "react-new-window";
import D3Tree from "./D3Tree";
import { useReactToPrint } from "react-to-print";
import { Menu, Upload, message, Button } from "antd";
import ReactDOMServer from 'react-dom/server';


class ComponentToPrint extends React.Component {
  componentDidMount() {
    Window.test = this;
  }

  render() {
    return (
      <div>
        <h1>Tree1</h1>
        <D3Tree
          data={{
            ID: 0,
            name: "a",
            operator: "OR",
            children: [
              { ID: 1, name: "b" },
              { ID: 2, name: "c" },
              { ID: 3, name: "d" },
            ],
          }}
        ></D3Tree>
      </div>
    );
  }
}
const Example = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      <ComponentToPrint ref={componentRef} />
      <button
        onClick={console.log(
          ReactDOMServer.renderToString(<ComponentToPrint></ComponentToPrint>)
        )}
      >
        Print this out!
      </button>
    </div>
  );
};

export default Example;
