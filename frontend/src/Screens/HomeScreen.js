import { Col, Row } from "react-bootstrap";
import Product from "../Components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import LoadingSpinner from "../Components/LoadingSpinner";
import MessageAlert from "../Components/MessageAlert";
import { useParams } from "react-router-dom";
import Paginate from "../Components/Paginate";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ pageNumber, keyword });

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <MessageAlert variant="danger">
          {error?.data?.message || error.error}
        </MessageAlert>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {data.products.map((product) => (
              <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate page={data.page} pages={data.pages} keyword={ keyword ? keyword : ""} />
        </>
      )}
    </>
  );
};

export default HomeScreen;
