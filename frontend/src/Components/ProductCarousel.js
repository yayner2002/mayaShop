import React from "react";
import { useGetTopRatedProductsQuery } from "../slices/productsApiSlice";
import MessageAlert from "./MessageAlert";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopRatedProductsQuery();
  return (
    <>
      { isLoading ? ("") : error ? (
        <MessageAlert variant="danger">{error}</MessageAlert>
      ) : (
        <>
          <Carousel pause="hover" className="bg-primary mb-4">
            {products.map((product) => (
              <Carousel.Item key={product._id}>
                <Link to={`/products/${product._id}`}>
                  <Image src={product.image} alt={product.name} fluid />
                  <Carousel.Caption className="carousel-caption">
                    <h2>
                      {product.name}({product.price})
                    </h2>
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
