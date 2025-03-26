import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from '../../components/Layout/Layout.jsx';
import { useAuth } from '../../context/Auth.jsx';

const Login = () => {
  const {auth, setAuth,isAuthenticated} = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/v1/auth/login', formData);
      if (res && res.data.success) {
        toast.success(res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem('auth', JSON.stringify(res.data));
        // isAuthenticated(true);
        navigate('/');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to login');
    }
  };

  return (
    <Layout>
      <div className="container login-page mt-2">
        <div className="row mt-5">
          <div className="col-md-12">
            <form onSubmit={handleSubmit} className="login-form container row g-3 p-3">
              <h4 className="">LOGIN FORM</h4>
              <div className="col-md-12">
                <label htmlFor="inputEmail4" className="form-label">
                  EMAIL <strong>*</strong>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control shadow-none"
                  id="inputEmail4"
                />
              </div>
              <div className="col-12">
                <label htmlFor="inputpassword" className="form-label shadow-none">
                  PASSWORD<strong>*</strong>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-control shadow-none"
                  id="inputpassword"
                />
              </div>
              <div className="col-6 registr-back">
                <button type="submit" className="rounded-0 btn btn-primary">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
