import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout/Layout.jsx'
import SideBar from '../../../components/SideBar.jsx'
import axios from 'axios';

const AadminRegistrationRequest = () => {
    const [agents, setAllAgents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFlightDeals();
    }, []);

    const fetchFlightDeals = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('/api/v1/auth/agent-request');
            setAllAgents(res.data);
            console.log(res.data);
        } catch (error) {
            setError(error.response.message || 'Something went wrong ');
        }
        finally {
            setLoading(false);
        }
    }

    const updateStatus = async (id, status) => {
        console.log(id, status)

        const res = await axios.patch(`/api/v1/auth/status/${id}`, { status });
        console.log("status updated")
        console.log(res);

        await fetchFlightDeals();
    };
    return (
        <>
            <Layout>
                <div className="d-flex ">
                    <SideBar />
                    {/* Main Content */}
                    <div className="flex-grow-1 p-4" >
                        <h2 className='text-start'>All Registered  Agents</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Number</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Status</th>


                                </tr>
                            </thead>

                            <tbody>
                                {agents ? (
                                    <>
                                        {
                                            agents?.data?.map((deal, index) => (
                                                <tr key={deal._id}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{deal.userName}</td>
                                                    <td>{deal.email}</td>
                                                    <td>{deal.number || '-'}</td>
                                                    <td>{deal.role}</td>
                                                    <td>
                                                        {/* <button
                                                        className={
                                                            deal.status === 'pending' ? 'btn btn-warning' :
                                                                deal.status === 'success' ? 'btn btn-success' :
                                                                    ''
                                                        }
                                                    >
                                                        {deal.status}
                                                    </button> */}
                                                        {deal.status === "pending" ? (
                                                            <>
                                                                <button className='btn btn-primary' onClick={() => updateStatus(deal._id, "approved")}>Approve</button>
                                                                <button className='btn btn-danger' onClick={() => updateStatus(deal._id, "rejected")}>Reject</button>
                                                            </>
                                                        ) : (
                                                            <success>{
                                                                <button
                                                                    className={
                                                                        deal.status === 'rejected' ? 'btn btn-warning' :
                                                                            deal.status === 'approved' ? 'btn btn-success' :
                                                                                ''
                                                                    }
                                                                    onClick={() => updateStatus(deal._id, deal.status === 'approved' ? "rejected" : "approved")}>
                                                                    {deal.status}
                                                                </button>
                                                            }</success>
                                                        )}
                                                    </td>

                                                </tr>

                                            ))
                                        }
                                    </>
                                ) : (

                                    <tr>
                                        <td colSpan="23" className="text-center">
                                            {loading ? 'Loading...' : error ? error : 'No Users data  available.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>

            </Layout>
        </>
    )
}

export default AadminRegistrationRequest