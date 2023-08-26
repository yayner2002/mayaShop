import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import MessageAlert from "../../Components/MessageAlert";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { useGetUsersQuery } from "../../slices/usersApiSlice";

const UserListScreen = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();

  const deleteHandler = (id) => {
    console.log("deleteHandler", id);
  };

  return (
    <div>
      <h1>User Lsit</h1>
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
