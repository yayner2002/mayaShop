import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import MessageAlert from "../../Components/MessageAlert";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import { FaTimes } from "react-icons/fa";
import Paginate from "../../Components/Paginate";
import { useParams } from "react-router-dom";

const OrderListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error } = useGetOrdersQuery({ pageNumber });
  return (
    <>
      <h1>Order Lsit</h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <MessageAlert variant="danger">
          <strong>{error?.data?.message}</strong>
        </MessageAlert>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Date</th>
                <th>Total Price</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.orders &&
                data.orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user && order.user.name}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>${order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/orders/${order._id}`}>
                        <Button variant="light" className="btn-sm">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <Paginate page={data.page} pages={data.pages} isAdmin={true} isOrder={true} />
        </>
      )}
    </>
  );
};

export default OrderListScreen;
