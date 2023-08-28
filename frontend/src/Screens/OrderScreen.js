import { Link, useParams } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Image,
  ListGroup,
  ListGroupItem,
  Button,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import MessageAlert from "../Components/MessageAlert";
import LoadingSpinner from "../Components/LoadingSpinner";
import { useSelector } from "react-redux";

const OrderScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPayOrder }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          // if the paypal script is not loaded
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  const onApprove = (data, actions) => {
    // this is the function that is called when the user clicks the pay button and every thing goes as planed
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({
          orderId,
          details,
        });
        refetch();
        toast.success("Payment Successfull");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  };
  // const onApproveTest = async () => {
  //   await payOrder({
  //     orderId,
  //     details: { payer: { email_address: userInfo.email } },
  //   });
  //   refetch();
  //   toast.success("Payment Successfull");
  // };
  const onError = (err) => {
    // called when there is an error
    toast.error(err?.data?.message || err.message);
  };
  const createOrder = (data, actions) => {
    // called when the user clicks the pay button
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice,
          },
        },
      ],
    });
  };

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order Delivered");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };
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
                <strong>Name:</strong>{" "}
                {order?.user ? order.user.name : "User Name Not Available"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {order.user ? order.user.email : "User Email Not Available"}
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
                  {!order.isPaid && (
                    <ListGroupItem>
                      {loadingPayOrder && <LoadingSpinner />}
                      {isPending ? (
                        <LoadingSpinner />
                      ) : (
                        <div>
                          {/* <Button
                            onClick={onApproveTest}
                            style={{
                              marginBottom: "10px",
                            }}
                          >
                            Test Pay Order With Out PayPal
                          </Button>
                          {
                            " sets  the isPaid to true and updates the order in the database"
                          } */}
                          <div>
                            <PayPalButtons
                              onApprove={onApprove}
                              onError={onError}
                              createOrder={createOrder}
                            ></PayPalButtons>
                          </div>
                        </div>
                      )}
                    </ListGroupItem>
                  )}
                  {loadingDeliver && <LoadingSpinner />}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    !order.isDelivered && (
                      <ListGroupItem>
                        <Button
                          onClick={deliverOrderHandler}
                          className="btn btn-block"
                        >
                          Mark As Delivered
                        </Button>
                      </ListGroupItem>
                    )}
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
