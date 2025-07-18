import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Layout from '../../../components/Layout/Layout.jsx';
import SideBar from '../../../components/SideBar.jsx';


const SuperAdminRegister = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "superadmin"
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
        <div className="d-flex ">
          <SideBar />

          <div className="registr-img mt-3 mb-3">
            <div className="container-fluid  text-light py-3"></div>
            <section className="container my-2  w-55 text-light p-2">
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
                  >

                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="superadmin" >Superadmin</option>
                    <option value="agent">Agent</option>
                  </select>
                </div>



                <div className="col-6 registr-back">
                  <button type="submit" className=" rounded-0 btn btn-primary">
                    Create Account
                  </button>
                </div>
              </form>
            </section>
          </div>

        </div>

      </>

    </Layout>
  )
}

export default SuperAdminRegister