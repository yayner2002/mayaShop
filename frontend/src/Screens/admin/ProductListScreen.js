import { Col, Row, Table, Button } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import MessageAlert from "../../Components/MessageAlert";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { useParams } from "react-router-dom";
import Paginate from "../../Components/Paginate";

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [createProduct, { isLoading: loadingCreate, error: createError }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete, error: deleteError }] =
    useDeleteProductMutation();

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct();
        toast.success(
          "Sample Product created successfully and you can edit it now."
        );
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  const deleteHandler = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await deleteProduct(productId);
        toast.success(res.data.message);
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
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
          <LinkContainer to="/admin/productlist">
            <Button className="m-3" onClick={createProductHandler}>
              <FaEdit /> Create Product
            </Button>
          </LinkContainer>
        </Col>
      </Row>
      {loadingCreate && <LoadingSpinner />}
      {loadingDelete && <LoadingSpinner />}
      {deleteError && (
        <MessageAlert variant="danger">
          {deleteError?.data?.message || deleteError.error}
        </MessageAlert>
      )}
      {createError && (
        <MessageAlert variant="danger">
          {createError?.data?.message || createError.error}
        </MessageAlert>
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
              {data.products &&
                data.products.map((product) => (
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
          <Paginate page={data.page} pages={data.pages} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
