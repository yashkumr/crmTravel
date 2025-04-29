import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from '../../components/Layout/Layout.jsx';
import { useAuth } from '../../context/Auth.jsx';

const Login = () => {
  const { auth, setAuth } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
 });
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    
    e.preventDefault();
    try {
      if (!otpSent) {

        const res = await axios.post('/api/v1/auth/send-otp', { email: formData.email, password: formData.password });

        if (res && res.data.success) {

          toast.success(res.data.message);
          setOtpSent(true);
        } else {

          toast.error(res.data.message); // Use toast.error for error messages
        }
      } else {

        const res = await axios.post('/api/v1/auth/login', formData);
        if (res && res.data.success) {
          toast.success(res.data.message);
          setAuth({
            ...auth,
            user: res.data.user,
            token: res.data.token,
          });
          localStorage.setItem('auth', JSON.stringify(res.data));
          navigate('/');
        } else {
         
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again2.');
    }
  };

  return (

    <div className="container login-page mt-2">
      <div className="row mt-5">
        <div className="col-md-12">
          <form onSubmit={handleLogin} className="login-form container row g-3 p-3">

            {otpSent ? (
              <div className="col-12">
                <label htmlFor="inputOtp" className="form-label">
                  OTP<strong>*</strong>
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="form-control shadow-none"
                  id="inputOtp"
                />
              </div>
            ) : <>

              <h4>LOGIN FORM</h4>
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
                <label htmlFor="inputpassword" className="form-label">
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


            </>}

            <div className="col-12">
              <button type="submit" className="rounded-0 btn btn-primary">
                {otpSent ? 'Verify ' : 'login'}
              </button>

              <div className='d-flex'>  <span className='text-dark p-1'>Have't an Account</span> <NavLink to="/zts-register" className="p-1"> Register</NavLink> </div>


            </div>

          </form>
        </div>
      </div>
    </div>

  );
};

export default Login;
