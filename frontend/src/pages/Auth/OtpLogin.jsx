import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout.jsx';
import SideBar from '../../components/SideBar.jsx';
import toast from 'react-hot-toast';
import moment from 'moment';

const OtpLogin = () => {
    const [otpUser, setOtpUser] = useState([]); // State for OTP users

    useEffect(() => {
        fetchAdmin(); // Fetch data on component mount
    }, []);

    const fetchAdmin = async () => {
        try {
            const res = await axios.get('/api/v1/auth/get-otp-agent');
            if (res?.data) {
                setOtpUser(res.data); // Update state with fetched data
            } else {
                setOtpUser([]); // Clear state if no data
            }
        } catch (err) {
            console.error('Error fetching admins:', err);
        }
    };

    const updateOtpStatus = async (id, otpEmail, otpStatus) => {
        try {
            const res = await axios.post(`/api/v1/auth/agent-otp-status/${id}`, { otpEmail, otpStatus });
            if (res?.data?.success) {
                toast.success(res.data.message); // Show success message
                await fetchAdmin(); // Refresh data
                // if( deals._id ===  id){
                //     deals.status = status;
                //   }
                console.log('OTP status updated:', res.data);
            } else {
                toast.error(res.data.message || 'Something went wrong!');
            }
        } catch (error) {
            console.error('Error updating OTP status:', error);
            toast.error('Failed to update status!');
        }
    };

    return (
        <Layout>
            <div className="d-flex">
                <SideBar />
                {/* Main Content */}
                <div className="flex-grow-1 p-4">
                    <h2 className="text-start">Admins</h2>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Number</th>
                                <th scope="col">Role</th>
                                <th scope="col">Otp</th>
                                <th scope="col">Expired At</th>
                                <th scope="col">Send Otp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {otpUser?.data?.length > 0 ? (
                                otpUser.data.map((deal, index) => (
                                    <tr key={deal._id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{deal.userName}</td>
                                        <td>{deal.email}</td>
                                        <td>{deal.number || '-'}</td>
                                        <td>{deal.role}</td>
                                        <td>{deal?.otp?.value || '-'}</td>
                                        <td>{deal?.otp?.expiresAt ? moment(deal.otp.expiresAt).format('YYYY-MM-DD HH:mm:ss') : '-'}</td>
                                        <td>
                                            {deal?.otp?.value ? (
                                                <button
                                                    className="btn btn-primary btn-sm text-nowrap"
                                                    onClick={() => updateOtpStatus(deal._id, deal.email, deal.otp.value)}
                                                >
                                                    Send Otp
                                                </button>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        <h1>Not available</h1>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default OtpLogin;
