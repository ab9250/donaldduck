import {Form, Row, Col, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import React,{useState} from 'react';
import { API } from "aws-amplify";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@procter-gamble/pg-styles";
import "@procter-gamble/pg-styles/css/fontawesome.min.css";

const initialState = {
    firstNum: 0,
    secondNum: 0,
    answer: 0
    };

function Calculator(){
    const [{firstNum, secondNum}, setState] =useState(initialState);
    const [operator,setOperator]=useState('Operator');
    const [answer, setAnswer]=useState(0)

    const clearState = ()=>{setState({...initialState});}

    const onChange = (e) => {const {name, value} = e.target; 
    setState((prevState)=> ({...prevState, [name]: value}));}

    const handleReset = (e) => {e.preventDefault();setTimeout(() => {
        clearState();}, 1000);}
    
    const handleSelect=(e)=>{
            console.log(e);
            setOperator(e)
            }
    
    const handleEquals=()=>{
        let data = {x:firstNum, y:secondNum, operator:operator};
        API.post("mypgs-training-2", "/calculator",{
            withCredentials: true,
            body: data
        })
        .then(response => {
            setAnswer(response)
        })
    }


return (
    <div>
        <h5 className="mt-4" align="center">This Calculator is built using a public SOAP API</h5>
        <Form className="mt-4">
            <Row>
                <Col><Form.Control type="number" value={firstNum} name="firstNum" onChange={onChange}/></Col>
                <Col>
                <DropdownButton title={operator} id="dropdown-menu-align-end"  onSelect={handleSelect}>
                    <Dropdown.Item eventKey="add"> + </Dropdown.Item>
                    <Dropdown.Item eventKey="sub"> - </Dropdown.Item>
                    <Dropdown.Item eventKey="multi"> * </Dropdown.Item>
                    <Dropdown.Item eventKey="divide"> / </Dropdown.Item>
                </DropdownButton>
                </Col>
                <Col><Form.Control type="number" value={secondNum} name="secondNum" onChange={onChange} /></Col>
                <Col><Button onClick={handleEquals}>=</Button></Col>
                <Col><Form.Control type="text" placeholder={answer} readOnly /></Col>
                <Col><Button onClick={handleReset}>Reset</Button></Col>
            </Row>
        </Form>
    </div>

);
}
            
export default Calculator;