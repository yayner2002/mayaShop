import React from "react";
import { useGetTopRatedProductsQuery } from "../slices/productsApiSlice";
import MessageAlert from "./MessageAlert";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopRatedProductsQuery();
  return (
    <>
      {isLoading ? (
        ""
      ) : error ? (
        <MessageAlert variant="danger">{error}</MessageAlert>
      ) : (
        <>
          <Carousel pause="hover" className="bg-primary mb-4">
            {products.map((product) => (
              <Carousel.Item key={product._id}>
                <Link to={`/product/${product._id}`}>
                  <Image src={product.image} alt={product.name} width="52%"  />
                  <Carousel.Caption>
                    <h3>
                      {" "}
                      {product.name}({product.price})
                    </h3>
                    <p>
                      {product.description}
                    </p>
                  </Carousel.Caption>
                </Link>
              </Carousel.Item>
            ))}
          </Carousel>
        </>
      )}
    </>
  );
};

export default ProductCarousel;
