import { Col, Row } from "react-bootstrap";
import Product from "../Components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import LoadingSpinner from "../Components/LoadingSpinner";
import MessageAlert from "../Components/MessageAlert";

const HomeScreen = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <MessageAlert variant="danger">{error?.data?.message || error.error}</MessageAlert>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {products.map((product) => (
              <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
