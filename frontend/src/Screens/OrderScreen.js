import { Link, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Row,
  Col,
  Image,
  Form,
  ListGroup,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useGetOrderDetailsQuery } from "../slices/ordersApiSlice";
import MessageAlert from "../Components/MessageAlert";
import LoadingSpinner from "../Components/LoadingSpinner";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);
  console.log(order);

  return isLoading ? (
    <LoadingSpinner />
  ) : error ? (
    <MessageAlert variant="danger">{error?.data?.message}</MessageAlert>
  ) : (
    <>
      <h1>Order: {order._id} </h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong> {order.user.name},{" "}
              </p>
              <p>
                <strong>Email:</strong> {order.user.email},{" "}
              </p>
              <p>
                <strong>Adress:</strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <MessageAlert variant="success">
                  Delivered on {order.deliveredAt}
                </MessageAlert>
              ) : (
                <MessageAlert variant="danger">Not Delivered</MessageAlert>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <MessageAlert variant="success">
                  Paid At {order.paidAt}
                </MessageAlert>
              ) : (
                <MessageAlert variant="danger">Not Paid</MessageAlert>
              )}
            </ListGroup.Item>
          </ListGroup>
          <ListGroup.Item>
            <h2>Ordered Items</h2>
            {order.orderItems.map((item, index) => (
              <ListGroup.Item key={item.index}>
                <Row>
                  <Col md={1}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={2}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={4}>
                    {item.qty} x ${item.price} = ${item.qty * item.price}
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup.Item>
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>${order.itemsPrice}</Col>
                    </Row>

                    <Row>
                      <Col>Shipping</Col>
                      <Col>${order.shippingPrice}</Col>
                    </Row>

                    <Row>
                      <Col>Tax</Col>
                      <Col>${order.taxPrice}</Col>
                    </Row>
                    <Row>
                      <Col>Total</Col>
                      <Col>${order.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
