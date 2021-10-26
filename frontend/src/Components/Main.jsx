import React, { Component } from "react";
import Home from "./Home";
import Calculator from "./Calculator"
import CatGif from "./CatGif"
import Footer from "@procter-gamble/pg-react-footer";
import Settings from "./Settings";
import Help from "./Help";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navigation from "@procter-gamble/pg-react-navigation";
import Header from "@procter-gamble/pg-react-header";
import $ from "jquery"; // eslint-disable-line no-unused-vars
import Popper from "popper.js"; // eslint-disable-line no-unused-vars
import { API } from "aws-amplify";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@procter-gamble/pg-styles";
import "@procter-gamble/pg-styles/css/fontawesome.min.css";

const title = "Vera's Training App";
const search = false;

const LightTheme = React.lazy(() => import("./Themes/lightTheme"));
const DarkTheme = React.lazy(() => import("./Themes/darkTheme"));

const iconFragment = (
  <React.Fragment>
    <a className="d-none d-lg-block p-2 float-right" href="/help">
      <i className="fas fa-question-circle"></i>
    </a>
    <a className="d-none d-lg-block p-2 float-right" href="/settings">
      <i className="fas fa-cog"></i>
    </a>
  </React.Fragment>
);

const items = [
  {
    id: "home",
    title: "Home",
    link: "/",
    external: false,
    hideSideNav: true
  },
  {
    id: "catGif",
    title: "Cat Gif",
    link: "/CatGif",
    external: false,
    hideSideNav: true
  },
  {
    id: "calculator",
    title: "Calculator",
    link: "/Calculator",
    external: false,
    hideSideNav: true
  }
];

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      timesVisited: "",
      location: "",
      darkTheme: false
    };
  }

  componentDidMount() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      this.setState({darkTheme: true});
      }

    API.get("mypgs-training-2", "/user", {
      withCredentials: true
    })
      .then(response => {
        this.setState({
          user: response.pk,
          timesVisited: response.visit_count,
          location: response.saved_location
          
        })
        console.log(this.state.user);
        console.log(this.state.timesVisited);
        console.log(this.state.location);
      })
      .catch(error => {
        console.log("error");
        console.log(error);
      });


  }

  render() {
    return (
        <>
        {this.state.user && (
          <Router>
            <React.Suspense fallback={<></>}>
              {!this.state.darkTheme && <LightTheme />}
              {this.state.darkTheme && <DarkTheme />}
          <Header title={title} search={search} iconFragment={iconFragment} />
          <Navigation items={items} showTopNavWithChild={true}>
            <div className="container-fluid mb-auto">
              <Route exact path="/" render={(props) => <Home {...props} state={this.state}/>}  />
              <Route path="/calculator" component={Calculator}/>
              <Route path="/settings" component={Settings} />
              <Route path="/help" component={Help} />
              <Route path="/catGif" render={(props) => <CatGif {...props} user={this.state.user}/>}/>
            </div>
          </Navigation>
          <Footer />
          </React.Suspense>
          </Router>
          )}
  </>
      
      );
  }
}

export default Main;


