import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import MessageAlert from "../../Components/MessageAlert";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";

const UserListScreen = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete, error: deleteError }] =
    useDeleteUserMutation();

  const deleteHandler = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await deleteUser(userId);
        toast.success(res.data.message);
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <div>
      <h1>User Lsit</h1>
      {loadingDelete && <LoadingSpinner />}
      {deleteError && (
        <MessageAlert variant="danger">
          {deleteError?.data?.message}
        </MessageAlert>
      )}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <MessageAlert variant="danger">
          <strong>{error?.data?.message}</strong>
        </MessageAlert>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>User Email</th>
              <th>IsAdmin</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>

                  <td>
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(user._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserListScreen;
