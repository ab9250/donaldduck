import React, { useState} from 'react';
import "@procter-gamble/pg-styles";
import "@procter-gamble/pg-styles/css/fontawesome.min.css";
import { API } from "aws-amplify";
import WeatherCard from "./WeatherCard"
import {Container, Col, Row } from 'react-bootstrap';



function Weather () {
    const [saveLocation, setSaved] = useState(false)
    const [location, setLocation] = useState({
        zipcode:"",
        unit:"",
        country:""
    })
    const [weather, setWeather]  = useState({
        city: '',
        currentTemp: '',
        feelsLike:'',
        humidity:'', 
        description:'', 
        unitMarker:(location.unit == "imperial") ? "F" : "C"
    })

    
    const handleChange = (e) => {
        setLocation({...location, [e.target.name]: e.target.value})
    }

    
    const countries= [
        {label: "United States", value: "US"},
        {label: "Costa Rica", value:"CR"},
        {label: "Great Britain", value:"GB"}
    ]

    const handleCheckbox=()=>{
        setSaved(!saveLocation)
    }

    const saveWeatherReport = () => {
        let weatherData = {zipcode:location.zipcode, country:location.country, unit:location.unit}
        console.log(weatherData)
        API.post("mypgs-training-2", "/saveLocation",{
            withCredentials:true,
            body: weatherData
        })
        
    }

    const getWeather = (e) => {
        e.preventDefault()
        API.get("mypgs-training-2", `/weather?zip=${location.zipcode},${location.country}&unit=${location.unit}`, {
            withCredentials: true,
        }).then(response => {
                console.log(response)
                if(response.cod == 404){
                    alert("Please enter a valid location")}
                else{    
                setWeather(weather => ({...weather, city: response.name, currentTemp:response.main.temp,
                    feelsLike:response.main.feels_like, humidity:response.main.humidity, 
                    description:response.weather[0].main, unitMarker:(location.unit == "imperial") ? "F" : "C"}))}
                
                })
        if (saveLocation == true) {
            saveWeatherReport()
        }
        
        

    }



    return (
        <div>
            <Container fluid>
                <Row className="row mt-5">
                    <Col>
                    <h5>Search for a location to see the current weather</h5>
            <form onSubmit={getWeather}>
            <div class="form-group">
                <select class="form-control" onChange={handleChange} name="country" required>
                <option value="" disabled selected>Choose Country</option>
                    {countries.map((country)=> <option value={country.value} >{country.label}</option>)}
                </select>
            </div>
            <div class="form-group">
                <input type="text" class="form-control" name="zipcode" placeholder="Enter Postal Code" value={location.zipcode} onChange={handleChange} required/>
            </div>
            <div class="form-group">
                <select class="form-control" name="unit" onChange={handleChange} value={location.unit} required>
                <option value="" disabled selected>Choose Temp Preference</option>
                <option value="imperial">Fahrenheit</option>
                <option value="metric">Celsius</option>
                </select>
            </div>
            <div class="form-group form-check">
                <label class="form-check-label">
                    <input class="form-check-input" type="checkbox" checked={saveLocation} onChange={handleCheckbox}/> Save To Dashboard
                </label>
            </div>
            <button class="btn btn-primary mb-5" type="submit" >Get Weather Report</button> 
            </form>
            </Col>
            
            <Col>
            <WeatherCard weather={weather}/>
            </Col>
            </Row>
            </Container>
        </div>
    )
}

export default Weather
