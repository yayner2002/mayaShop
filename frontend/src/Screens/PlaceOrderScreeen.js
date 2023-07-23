import React, { useEffect } from "react";
import CheckoutSteps from "../Components/CheckoutSteps";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"
import { Row, Col, Button, ListGroup, Image, Card} from "react-bootstrap"

const PlaceOrderScreeen = () => {
  const navigate = useNavigate()
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if(!cart.shippingAddress.address) {
      navigate('/shipping')
    } else if (!cart.paymentMethod) {
      navigate("/payment")
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          Column
          </Col>
          <Col md={4}>
            Column
            </Col>
        </Row>
    </>
  );
};

export default PlaceOrderScreeen;
