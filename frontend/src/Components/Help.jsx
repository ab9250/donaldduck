import React from "react";

class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    return (
      <div className="main-container height-100">
        <div className="center-v-h">
          <h2 className="center-h">Help</h2>
          <div className="container">
            <div className="center-h">
              <span> For additional help such as reporting errors, feature request, or additional support please submit
                  a ServiceNow Ticket </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Help;
