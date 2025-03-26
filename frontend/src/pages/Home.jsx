import React, { useState } from 'react'
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

        {/* <div className='d-flex flex-column'>
          
          <button
            className={` ${isSidebarVisible ? "hide1" : "show1"}`}
            onClick={toggleSidebar}
          >
            <RxHamburgerMenu />
          </button>
        
          {isSidebarVisible && (
            <div className="bg-light p-3" style={{ position: "relative", width: "250px", minHeight: "100vh" }}>
    

              <ul className="list-unstyled">
                <li className="mb-3">
                  <a href="#admins" className="text-decoration-none text-dark">
                    Admins
                  </a>
                </li>
                <li className="mb-3">
                  <a href="#users" className="text-decoration-none text-dark">
                    Users
                  </a>
                </li>
                <li className="mb-3">
                  <a href="#agents" className="text-decoration-none text-dark">
                    Agents
                  </a>
                </li>
                <li className="mb-3">
                  <a href="#brokers" className="text-decoration-none text-dark">
                    Brokers
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div> */}

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
                Comparison 1
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
                Comparison 2
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
                Comparison 3
              </button>
            </div>
            <div className="tab-content" id="comparison-tabs-content">
              <div
                className="tab-pane fade show active"
                id="comparison1"
                role="tabpanel"
                aria-labelledby="comparison1-tab"
              >
                <div className="mt-3">
                  <h5>Comparison 1</h5>
                  <p>Details about comparison 1 go here...</p>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="comparison2"
                role="tabpanel"
                aria-labelledby="comparison2-tab"
              >
                <div className="mt-3">
                  <h5>Comparison 2</h5>
                  <p>Details about comparison 2 go here...</p>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="comparison3"
                role="tabpanel"
                aria-labelledby="comparison3-tab"
              >
                <div className="mt-3">
                  <h5>Comparison 3</h5>
                  <p>Details about comparison 3 go here...</p>
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