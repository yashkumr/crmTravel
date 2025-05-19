import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout.jsx';
import SideBar from '../../components/SideBar.jsx';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const BookingMails = () => {
    const [bookingMails, setBookingMails] = useState([]);
    const [originalBookingMails, setOriginalBookingMails] = useState([]); // Store the original data

    const location  = useLocation();

    const url  = location.search.split("?")[1]?.split("&").find(param => param.startsWith("url="))?.split("=")[1];

    // useEffect(() => {
    //     const fetchBookingMails = async () => {
    //         try {
    //             const res = await axios.get('/api/v1/flights/get-booking-mails');

    //             if (res.data.success) {
    //                 setBookingMails(res.data.combinedData);
    //                 setOriginalBookingMails(res.data.combinedData); // Save the original data
    //             } else {
    //                 console.error('Failed to fetch booking mails:', res.data.message);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching booking mails:', error);
    //         }
    //     };

    //     fetchBookingMails();
    // }, []);

    useEffect(() => {
    const fetchBookingMails = async () => {
        try {
            const res = await axios.get('/api/v1/flights/get-booking-mails');

            if (res.data.success) {
                setOriginalBookingMails(res.data.combinedData); // Save the original data

                // Filter data by the URL parameter if it exists
                if (url) {
                    const filteredMails = res.data.combinedData.filter(mailData => mailData?.webUrl === url);
                    setBookingMails(filteredMails);
                } else {
                    setBookingMails(res.data.combinedData); // Default to all data
                }
            } else {
                console.error('Failed to fetch booking mails:', res.data.message);
            }
        } catch (error) {
            console.error('Error fetching booking mails:', error);
        }
    };

    fetchBookingMails();
}, [url]);



    const handleButtonClick = async (url, mail) => {
        if (!url) {
            console.error("URL is undefined");
            return;
        }

        try {
            const res = await axios.post("/api/v1/flights/webUrl", {
                webUrl: url,
                webMail: mail
            });
            

        } catch (error) {
            if (error.response) {
                console.error("Failed to send URL:", error.response.data);
            } else {
                console.error("Error sending URL:", error.message);
            }
        }
    };

    const uniqueValues = Array.from(new Set(
        bookingMails.map(mailData => JSON.stringify({ url: mailData?.webUrl, mail: mailData?.webMail }))
    ))
        .map(item => JSON.parse(item))
        .filter(item => item.url || item.mail);




    return (
        <Layout>
            <div className="d-flex">
                <SideBar />
                <div className="flex-grow-1 p-4">
                    <h2 className="text-start">Booking Mails</h2>
                    {/* Show all the existing webUrl and webMail once */}
                    <div>
                        <p className="text-start">Booking URLs and WebMails</p>
                        <div>
                            {
                                uniqueValues.length > 0 ? (
                                    <ul className="list-group">
                                        {uniqueValues.map((item, index) => (
                                            <li key={index} className="list-group-item">
                                                {item.url && (
                                                    <span
                                                        className="text-primary p-1"
                                                        style={{ background: "none", border: "none", textDecoration: "underline" }}
                                                    >
                                                        {item.url}
                                                    </span>
                                                )}
                                                {item.mail && (
                                                    <span className="text-secondary p-1" style={{ marginLeft: "10px" }}>
                                                        {item.mail}
                                                    </span>
                                                )}

                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleButtonClick(item.url, item.mail)}
                                                >
                                                    Run Deals
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No booking URLs or webMails available.</p>
                                )
                            }
                        </div>
                    </div>


                    <div className="d-flex justify-content-between align-items-center mb-3">

                        {/* filter by url */}
                        {/* <div className="text-start m-1 p-1">
                            <select
                                className="form-select"
                                onChange={(e) => {
                                    const selectedUrl = e.target.value;
                                   

                                    if (selectedUrl === "all") {
                                        setBookingMails(originalBookingMails);
                                    } else {
                                        const filteredMails = originalBookingMails.filter(mailData => mailData?.webUrl === selectedUrl);
                                        setBookingMails(filteredMails);
                                    }
                                }}
                            >
                                <option value="all" className='p-1 m-1'> All Urls</option>
                                {Array.from(new Set(originalBookingMails.map(mailData => mailData?.webUrl).filter(Boolean))).map((url, index) => (
                                    <option key={index} value={url}>
                                        {url}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                        <p></p>

                        {/* <button className="btn btn-success" onClick={() => window.location.reload()}>
                            Reload
                        </button> */}
                    </div>

                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Sr. No</th>
                                <th>Mail</th>
                                <th>Phone</th>
                                <th>Type</th>
                                <th>Website</th>
                                {/* <th>website Mail</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {bookingMails.map((mailData, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{mailData?.email}</td>
                                    <td>{mailData?.mobile}</td>
                                    <td>{mailData?.type}</td>
                                    <td>
                                        <span className='text-success outline-0 border-0 bg-transparent'

                                        >
                                            {mailData?.webUrl ? mailData?.webUrl : "No URL"}
                                        </span>
                                    </td>
                                    {/* <td>
                                        <span className='text-success outline-0 border-0 bg-transparent'

                                        >
                                            {mailData?.webMail ? mailData?.webMail : "No Mail"}
                                        </span>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default BookingMails;


