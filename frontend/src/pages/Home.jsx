import React, { } from 'react'
import Layout from '../components/Layout/Layout.jsx'
import { RxHamburgerMenu } from "react-icons/rx";
import SideBar from '../components/SideBar.jsx';
import { useFlightDeals } from '../context/FlightDealsContext.jsx';
import { useHotelDeals } from '../context/HotelDealsContext.jsx';

const Home = () => {

  const { flightDeals, setFlightDeals, loading, setLoading, errorCode, fetchFlightDeals } = useFlightDeals();
    const { fetchHotelDeals, hotelDeals, setHotelDeals} = useHotelDeals();


  const STATUS_NEW_BOOKING = "newBooking";
  const STATUS_REJECTED = "rejected";

  return (
    <Layout>
      <div className="d-flex ">
        <SideBar />


        {/* Main Content */}
        <div className="flex-grow-1 p-4" >
          <h2></h2>


          <div className="mt-4">
            <div className="nav nav-tabs" id="comparison-tabs" role="tablist">
              <button
                className="nav-link active"
                id="comparison1-tab"
                data-bs-toggle="tab"
                data-bs-target="#comparison1"
                type="button"
                role="tab"
                aria-controls="comparison1"
                aria-selected="true"
              >
                Flight Booking
              </button>
              <button
                className="nav-link"
                id="comparison2-tab"
                data-bs-toggle="tab"
                data-bs-target="#comparison2"
                type="button"
                role="tab"
                aria-controls="comparison2"
                aria-selected="false"
              >
                Hotel Booking
              </button>
              <button
                className="nav-link"
                id="comparison3-tab"
                data-bs-toggle="tab"
                data-bs-target="#comparison3"
                type="button"
                role="tab"
                aria-controls="comparison3"
                aria-selected="false"
              >
                closed Booking
              </button>
            </div>
            <div className="tab-content" id="comparison-tabs-content">

              <div
                className="tab-pane fade show active"
                id="comparison1"
                role="tabpanel"
                aria-labelledby="comparison1-tab"
              >
                <div className="mt-3 d-flex gap-3 justify-content-around border p-3 rounded">
                  <div className="mt-3 border p-4 rounded">
                    <h5>Today Booking</h5>
                    <p className='text-success'> <strong className='text-dark'>
                      {flightDeals.filter(
                        (deal) =>
                          new Date(deal.createdAt).toISOString().split("T")[0] ===
                          new Date().toISOString().split("T")[0]
                      ).lengthl  === 0 ? "No deals generated today": flightDeals.filter(
                        (deal) =>
                          new Date(deal.createdAt).toISOString().split("T")[0] ===
                          new Date().toISOString().split("T")[0]
                      ).length }
                    </strong> Flights Booking Generate </p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>New Booking  Booking</h5>
                    <p className='text-success'> <strong className='text-dark p-1 fw-bold'>
                      {flightDeals.filter((deal) => deal.status === STATUS_NEW_BOOKING)
                        .length}
                    </strong>Flights Booking Generate </p>
                  </div>

                </div>
                <div className="mt-3 d-flex gap-3 justify-content-around border p-3 rounded">
                  <div className="mt-3 border p-4 rounded">
                    <h5>Total Deals</h5>
                    <p className='text-success'> <strong className='text-dark'>
                      {flightDeals.length}
                    </strong> Flights Deals Generate </p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>Rejected Booking</h5>
                    <p className='text-success'> <strong className='text-dark p-1 fw-bold'>
                      {flightDeals.filter((deal) => deal.status === STATUS_REJECTED).length}
                    </strong>Flights Deals Rejected </p>
                  </div>

                </div>

              </div>

              <div
                className="tab-pane fade"
                id="comparison2"
                role="tabpanel"
                aria-labelledby="comparison2-tab"
              >
                 <div className="mt-3 d-flex gap-3 justify-content-around border p-3 rounded">
                  <div className="mt-3 border p-4 rounded">
                    <h5>Today Booking</h5>
                    <p className='text-success'> <strong className='text-dark'>
                      {/* {hotelDeals?.filter(
                        (deal) =>
                          new Date(deal.createdAt).toISOString().split("T")[0] ===
                          new Date().toISOString().split("T")[0]
                      ).length} */}
                    </strong>  </p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>New Booking  </h5>
                    <p className='text-success'> <strong className='text-dark p-1 fw-bold'>
                      {hotelDeals?.filter((deal) => deal.status === STATUS_NEW_BOOKING)
                        .length}
                    </strong>Flights Booking Generate </p>
                  </div>

                </div>
                <div className="mt-3 d-flex gap-3 justify-content-around border p-3 rounded">
                  <div className="mt-3 border p-4 rounded">
                    <h5>Total Booking</h5>
                    <p className='text-success'> <strong className='text-dark'>
                      {hotelDeals?.length}
                    </strong> Flights Booking Generate </p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>Rejected Booking</h5>
                    <p className='text-success'> <strong className='text-dark p-1 fw-bold'>
                      {hotelDeals?.filter((deal) => deal.status === STATUS_REJECTED).length}
                    </strong>Flights Booking Rejected </p>
                  </div>

                </div>
              </div>
              <div
                className="tab-pane fade"
                id="comparison3"
                role="tabpanel"
                aria-labelledby="comparison3-tab"
              >
                <div className="mt-3 d-flex gap-3 justify-content-around border p-3 rounded">
                  <div className="mt-3 border p-4 rounded">
                    <h5>Total Booking</h5>
                    <p className='text-success'> <strong>  {hotelDeals?.length + flightDeals.length} </strong>  Deals Generate </p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>closed Booking</h5>
                    <p className='text-success'><strong> {flightDeals?.filter((deal) => deal.status === "approved").length + hotelDeals?.filter((deal) => deal.status === "approved").length }</strong> Deals Closed</p>
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home