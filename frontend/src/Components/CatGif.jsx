import React, { useState, useEffect} from 'react';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@procter-gamble/pg-styles";
import "@procter-gamble/pg-styles/css/fontawesome.min.css";
import Loader from "react-loader-spinner"
import {Col, Row, Container} from 'react-bootstrap';


const CatGif = (props) => {
    const [text, setText] = useState(`Hi, ${props.user}!`);
    const[inputValue, setValue] = useState(`Hi, ${props.user}!`)
    const [isLoading, setLoading] = useState(true)
    const [gif, setGif] = useState(null)
    const [uniqueNum, setNum] = useState(0);


    //this function runs when the component loads and then only when the text or uniqueNum variables change state
    useEffect(() => {
        fetch(`https://cataas.com/cat/gif/says/${text}?s=40&c=white&uniqueNum=${uniqueNum}&width=500`)
        .then(response => {
            setGif(response.url)
            setLoading(false)
        })
    } , [text, uniqueNum])

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true)
        if (inputValue == ""){
            setText(" ")
        } else {
            setText(inputValue)
        }
        setNum(Math.random())
    }

    return (
    <div>
    <Container fluid>
    <Row className="row mt-5">
    <Col>
    {isLoading ? <Loader type="ThreeDots" color= "#003DA5"/> : <img src={gif} /> } 
    <br/>
    <br/>
    <label for="textBox">Customize your own random Cat Gif!</label>
    <br/>
    <input type="text" id="textBox" placeholder="Type Here" onChange= {e => setValue(e.target.value)}></input>
    <br/>
    <br/>
    <button onClick={handleSubmit}>New Cat</button>
    </Col>
    </Row>
    </Container>
    </div>
    ) 



}

export default CatGif
