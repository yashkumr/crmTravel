import React, {  } from 'react'
import Layout from '../components/Layout/Layout.jsx'
import { RxHamburgerMenu } from "react-icons/rx";
import SideBar from '../components/SideBar.jsx';

const Home = () => {
  // const [isSidebarVisible, setSidebarVisible] = useState(true);

  // const toggleSidebar = () => {
  //   setSidebarVisible(!isSidebarVisible);
  // };

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
                Last 15 Days Flight Deals
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
                Last 15 Days Hotel Deals
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
                Last 15 Days closed Deals
              </button>
            </div>
            <div className="tab-content" id="comparison-tabs-content">
              <div
                className="tab-pane fade show active"
                id="comparison1"
                role="tabpanel"
                aria-labelledby="comparison1-tab"
              >
                <div className="mt-3 d-flex gap-3 justify-content-between border p-3 rounded">
                  <div className="mt-3 border p-4 rounded">
                    <h5>Flights</h5>
                    <p>100 Flights Deals Generate </p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>closed Deals</h5>
                    <p>45 Flights Deals Generate </p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>Remaining Deals</h5>
                    <p>55 Flights Deals Generate </p>
                  </div>
                </div>

              </div>
              <div
                className="tab-pane fade"
                id="comparison2"
                role="tabpanel"
                aria-labelledby="comparison2-tab"
              >
                <div className="mt-3 d-flex gap-3 justify-content-between border p-3 rounded">
                  <div className="mt-3 border p-4 rounded">
                    <h5>Hotels</h5>
                    <p>100 Hotels Deals Generate </p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>closed Deals</h5>
                    <p>45 Hotels Deals Generate </p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>Remaining Deals</h5>
                    <p>55 Hotels Deals Generate </p>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="comparison3"
                role="tabpanel"
                aria-labelledby="comparison3-tab"
              >
                <div className="mt-3 d-flex gap-3 justify-content-between border p-3 rounded">
                  <div className="mt-3 border p-4 rounded">
                    <h5>Total Deals</h5>
                    <p>200  Deals Generate </p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>closed Deals</h5>
                    <p>95  Deals Generate </p>
                  </div>
                  <div className="mt-3 border p-4 rounded">
                    <h5>Remaining Deals</h5>
                    <p>105  Deals Generate </p>
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