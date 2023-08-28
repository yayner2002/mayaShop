import { Col, Row } from "react-bootstrap";
import Product from "../Components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import LoadingSpinner from "../Components/LoadingSpinner";
import MessageAlert from "../Components/MessageAlert";
import { Link, useParams } from "react-router-dom";
import Paginate from "../Components/Paginate";
import { FaArrowLeft } from "react-icons/fa";
import ProductCarousel from "../Components/ProductCarousel";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    pageNumber,
    keyword,
  });

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-outline-secondary mb-4">
          <FaArrowLeft style={{ marginRight: "3" }} /> Go Back
        </Link>
      )}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <MessageAlert variant="danger">
          {error?.data?.message || error.error}
        </MessageAlert>
      ) : (
        <>
          <h1>Featured Products</h1>
          <Row>
            {data.products.map((product) => (
              <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            page={data.page}
            pages={data.pages}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
