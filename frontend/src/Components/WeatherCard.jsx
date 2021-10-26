import React, { useEffect, useState } from 'react'
import {Card} from 'react-bootstrap';
import "@procter-gamble/pg-styles";
import "@procter-gamble/pg-styles/css/fontawesome.min.css";


function WeatherCard(props){

    const convertTemp = Math.round(props.weather.currentTemp)
    const convertFeelsLike = Math.round(props.weather.feelsLike)


        return (
            <>
            {props.weather.city &&(
            <div>
                <h5>The Current Weather in: </h5>
            <Card border="dark" style={{ width: '18rem' }}>
                <Card.Header>{props.weather.city}</Card.Header>
                    <Card.Body>
                        <Card.Title>{convertTemp} &deg;{props.weather.unitMarker}</Card.Title>
                        <Card.Text>{props.weather.description}</Card.Text>
                        <Card.Text>Feels Like: {convertFeelsLike} &deg;{props.weather.unitMarker}</Card.Text>
                        <Card.Text>Humidity: {props.weather.humidity} %</Card.Text>
                    </Card.Body>
            </Card>
            </div>
        )}</>)
}

export default WeatherCard