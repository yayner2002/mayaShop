import { Col, Row, Table, Button } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import {
  useGetProductsQuery,
  useCreateProductMutation,
} from "../../slices/productsApiSlice";
import MessageAlert from "../../Components/MessageAlert";
import LoadingSpinner from "../../Components/LoadingSpinner";

const deleteHandler = (id) => {
  if (window.confirm("Are you sure you want to delete this product?")) {
    // delete product
  }
};
const ProductListScreen = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();
  const [createProduct, { isLoading: loadingCreate, error: createError }] =
    useCreateProductMutation();

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct();
        toast.success("Product created successfully");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  return (
    <>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <LinkContainer to="/admin/product/create">
            <Button className="m-3" onClick={createProductHandler}>
              <FaEdit /> Create Product
            </Button>
          </LinkContainer>
        </Col>
      </Row>
      {loadingCreate && <LoadingSpinner />}
      {createError && (
        <MessageAlert variant="danger">{createError}</MessageAlert>
      )}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <MessageAlert>{error}</MessageAlert>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      {" "}
                      <LinkContainer to={`/admin/product/${product._id}/edit`}>
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FaTrash style={{ color: "white" }} />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ProductListScreen;
