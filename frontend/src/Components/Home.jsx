import React from "react";
import {Container, Col, Row } from 'react-bootstrap';
import Weather from "./Weather"
import { API } from "aws-amplify";
import CatPic from "./CatPic";
import "@procter-gamble/pg-styles";
import "@procter-gamble/pg-styles/css/fontawesome.min.css";
import WeatherCard from "./WeatherCard";



class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weather:{ 
        city: '',
        currentTemp: '',
        feelsLike:'', 
        humidity:'', 
        description:'', 
        unitMarker:(props.unit == "imperial") ? "F" : "C"
      },
      catPic:'',
      isLoading:true
    };
  }

  

  componentDidMount() {
    if(this.props.state.location != null){
      API.get("mypgs-training-2", `/weather?zip=${this.props.state.location.zipcode},
      ${this.props.state.location.country}&unit=${this.props.state.location.unit}`, {
        withCredentials: true,
    }).then(response => {
        this.setState({weather:{city: response.name, currentTemp:response.main.temp, 
          feelsLike:response.main.feels_like, humidity:response.main.humidity, 
          description:response.weather[0].main, unitMarker:(this.props.state.location.unit == "imperial") ? "F" : "C"}})
    })
    }
    

  }

  render() {
    return ( 
      <div>
        <Container fluid>
          <Row className="row mt-5">
            <Col> <h1 className="display-4">Welcome, {this.props.state.user}</h1></Col>
          </Row>
          <Row>
            <Col><CatPic user={this.props.state.user}/> </Col>
            <Col className="d-flex align-items-center" >{ (this.props.state.location == null) ? 
            <h4 align="center">Fill out the form below to save a location to your Dashboard</h4>:<WeatherCard weather={this.state.weather}/>}
            </Col>
          </Row>
          <Row>
            <Col> 
              <Weather user={this.props.state.user}/></Col>
          </Row>
        </Container>
      </div>
      );
    }
}

export default Home;

