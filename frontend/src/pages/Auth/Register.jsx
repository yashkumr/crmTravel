import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/Auth.jsx";
import Layout from '../../components/Layout/Layout.jsx';


const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "user"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevDAta) => ({
      ...prevDAta,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/v1/auth/register", formData);
      console.log(res.data);

      toast.success(res.data.message);
      navigate("/zts-login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <Layout>
      <>
        <div className="registr-img mt-3 mb-3">
          <div className="container-fluid  text-light py-3"></div>
          <section className="container my-2  w-50 text-light p-2">
            <form
              onSubmit={handleSubmit}
              className="register-form container row g-3 p-3"
            >
              <h4 className="text-dark">REGISTRATION FORM</h4>
              <div className="col-md-6 text-dark">
                <span className='text-dark'>name</span>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="form-control  shadow-none"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="col-md-6 text-gray">
                <span className='text-dark'>number</span>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className="form-control shadow-none"
                  placeholder="Number"
                  required
                />
              </div>

              <div className="col-md-12">
                <span className='text-dark'>Email</span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control "
                  required
                />
              </div>

              <div className="col-12">
                <label htmlFor="inputpassword" className="form-label text-dark ">
                  PASSWORD<strong>*</strong>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control shadow-none"
                  required
                />
              </div>
              <div className="col-12">
                <label htmlFor="inputRole" className="form-label text-dark">
                  Role<strong>*</strong>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select shadow-none"
                  id="inputRole"
                  required
                >
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                  {/* <option value="superadmin">Superadmin</option> */}
                  <option value="user">User</option>
                </select>
              </div>


              <div className="col-6 registr-back">
                <button type="submit" className=" rounded-0 btn btn-primary">
                  Create Account
                </button>

                <div className='d-flex'>  <span className='text-dark p-1'>Have an Account</span> <NavLink to="/zts-login" className="p-1"> Login</NavLink> </div>

              </div>
            </form>
          </section>
        </div>
      </>

    </Layout>
  )
}

export default Register