import axios from 'axios';
import React, { useEffect, useState } from 'react'
import SideBar from '../../components/SideBar.jsx';
import Layout from '../../components/Layout/Layout.jsx';
import toast from 'react-hot-toast';
import PopHotelDeals from './PopHotelDeals.jsx';

const HotelDeals = () => {

      const [hotelDealsPop, setHotelDealsPop] = useState(false);
      const [hotelDealsPopData, setHotelDealsPopData] = useState(null);

    const [hotelDeals, setHotelDeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    useEffect(() => {
        fetchHotelDeals();
    }, []);

    const fetchHotelDeals = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('/api/v1/hotels/get-hotels');
            setHotelDeals(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {

        const res = await axios.patch(`/api/v1/hotels/status/${id}`, { status });

        if (res && res.data.success) {

            toast.success(res.data.message);

            await fetchHotelDeals();

        }
        else {
            toast.error(res.data.message || "Something went wrong!");

        }
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentDeals = hotelDeals?.data?.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil((hotelDeals?.data?.length || 0) / itemsPerPage);


    const showHotelDealsPop = (deal) => {
        setHotelDealsPopData(deal);
        setHotelDealsPop(true);
    };

    const closeHotelPop = () => {
        setHotelDealsPop(false);
        setHotelDealsPopData(null);
    };

    return (
        <Layout>
            <div className="d-flex">
                <SideBar />
                <div className="flex-grow-1 p-4">
                    <h2 className='text-start'>All Hotel details</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>

                                <th>Mobile</th>
                                <th>Email</th>

                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDeals && currentDeals.length > 0 ? (
                                currentDeals.map((deal, index) => (
                                    <tr key={deal._id}>
                                        <td>{startIndex + index + 1}</td>
                                        <td>{deal.firstName}</td>

                                        <td>{deal.mobile}</td>
                                        <td>{deal.email}</td>

                                        <td className="d-flex gap-1">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => showHotelDealsPop(deal)}
                                            >
                                                View Details
                                            </button>
                                            {
                                                deal.status === 'pending' ? (
                                                    <>
                                                        <button className='btn btn-primary' onClick={() => updateStatus(deal._id, 'approved')}>Approve</button>
                                                        <button className='btn btn-danger' onClick={() => updateStatus(deal._id, 'rejected')}>Reject</button>
                                                    </>
                                                ) : (
                                                    <div>

                                                        {
                                                            <button className={deal?.status === "rejected" ? 'btn btn-warning' : deal.status === 'approved' ? "btn btn-success" : ''} > {deal?.status} </button>}

                                                    </div>

                                                )
                                            }
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="23" className="text-center">
                                        {loading ? 'Loading...' : error ? error : 'No Hotel deals available.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {
                        hotelDealsPop && (
                            <PopHotelDeals hotelDealsPop = {hotelDealsPop} deals = {hotelDealsPopData} onClose={closeHotelPop} />
                        )
                    }

                    {/* Pagination */}
                    <div className="pagination mt-3">
                        <button
                            className="btn btn-secondary mx-1"
                            onClick={() => handlePageChange(currentPage - 3)}
                            disabled={currentPage <= 3}
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) =>
                            i + 1 > currentPage - 3 && i + 1 < currentPage + 3 ? (
                                <button
                                    key={i}
                                    className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'} mx-1`}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ) : null
                        )}

                        <button
                            className="btn btn-secondary mx-1"
                            onClick={() => handlePageChange(currentPage + 3)}
                            disabled={currentPage + 3 > totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HotelDeals