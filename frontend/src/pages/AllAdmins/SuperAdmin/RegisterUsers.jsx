import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout.jsx";
import SideBar from "../../../components/SideBar.jsx";
import { MdDelete } from "react-icons/md";
import SuperThrash from "../../../components/SuperThrash.jsx";

const RegisterUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sprThrash, setSprThrash] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const closeSuperPop = () => {
    setShowModal(false);
  };

  const handleMoveToTrashSuccess = (id) => {
    setAllUsers(allUsers.filter((user) => user._id !== id));
    setShowModal(false);
  };
// crud operation in typeScript using plain backend and plain frontend with structure
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/v1/auth/get-all-users");
      setAllUsers(res.data.getAllusers.filter((user) => !user.isTrashed)); // Exclude trashed users
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`/api/v1/auth/status/${id}`, { status });
      console.log("Status updated");
      fetchUsers(); // Refresh the list after updating the status
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const rolesOrder = ["superadmin", "admin", "agent", "user"];

  return (
    <Layout>
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-4">
          <h2 className="text-start">All Zuber Teams</h2>
          {rolesOrder.map((role) => (
            <div key={role} className="mb-4">
              <h3 className="text-start text-uppercase mt-3">{role}</h3>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Number</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        {error}
                      </td>
                    </tr>
                  ) : allUsers.filter((user) => user.role === role).length >
                    0 ? (
                    allUsers
                      .filter((user) => user.role === role)
                      .map((user, index) => (
                        <tr key={user._id}>
                          <td>{index + 1}</td>
                          <td>{user.userName}</td>
                          <td>{user.email}</td>
                          <td>{user.number || "-"}</td>
                          <td>
                            {user.status === "pending" ? (
                              <>
                                <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    updateStatus(user._id, "approved")
                                  }
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() =>
                                    updateStatus(user._id, "rejected")
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <button
                                className={
                                  user.status === "rejected"
                                    ? "btn btn-warning"
                                    : "btn btn-success"
                                }
                                onClick={() =>
                                  updateStatus(
                                    user._id,
                                    user.status === "approved"
                                      ? "rejected"
                                      : "approved"
                                  )
                                }
                              >
                                {user.status === "approved"
                                  ? "Remove Access"
                                  : "Grant Access"}
                              </button>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                setShowModal(true);
                                setSprThrash(user._id);
                              }}
                            >
                              <MdDelete />
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No users in this role.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <SuperThrash
          setShowModal={setShowModal}
          sprThrash={sprThrash}
          onClose={closeSuperPop}
          onMoveToTrashSuccess={handleMoveToTrashSuccess}
        />
      )}
    </Layout>
  );
};

export default RegisterUsers;
