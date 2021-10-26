import React, { useState, useEffect} from 'react';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@procter-gamble/pg-styles";
import "@procter-gamble/pg-styles/css/fontawesome.min.css";
import Loader from "react-loader-spinner"
import {Col, Row, Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';

function CatPic(props) {
    const text = `Hi, ${props.user}!`
    const [isLoading, setLoading] = useState(true)
    const [pic, setPic] = useState(null)
    const [uniqueNum, setNum] = useState(0);

    useEffect(() => {
        fetch(`https://cataas.com/cat/says/${text}?s=40&c=white&uniqueNum=${uniqueNum}&height=300&type=md`)
        .then(response => {
            setPic(response.url)
            setLoading(false)
        })
    }, [uniqueNum])

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true)
        setNum(Math.random())
    }


    return (
        <div>
        <Container fluid>
    <Row className="row mt-4">
    <Col>
        {isLoading ? <Loader type="ThreeDots" color= "#003DA5"/> :
        <Col> 
        <img src={pic} /> 
        <br/>
        <button className="mt-3" onClick={handleSubmit}>New Cat</button>
        <h5 className="mt-3" >
        <Link to='/catGif'>Customize your own random Cat GIF here!</Link>
        </h5>
        </Col>}
        </Col>
        </Row>
        </Container>
        </div>
    )
}

export default CatPic
