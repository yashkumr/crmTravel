import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import axios from "axios";
import { NavLink } from "react-router-dom";

const GeneratePnrFlight = () => {
  const [pnrs, setPnrs] = useState([]);

  useEffect(
    () => async () => {
      try {
        const res = await axios.get("/api/v1/ctmFlights/generatePnrFlight");
        if (res.data.success) {
          setPnrs(res.data.pnrs);
        }
      } catch (error) {
        console.error("Error fetching PNR data:", error);
      }
    },
    []
  );

  return (
    <Layout>
      <div className="d-flex">
        <SideBar />

        <div className="flex-grow-1">
          <div className="flex-grow-1 p-4">
            <div className="card">
              <div className="card-body">
                <div className="p-4">
                  <table className="w-full border border-gray-300">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2">BID</th>
                        <th className="border px-4 py-2">CCH NAME</th>
                        <th className="border px-4 py-2">PROVIDER</th>
                        <th className="border px-4 py-2">STATUS</th>
                        <th className="border px-4 py-2">TRAVEL DATE</th>
                        <th className="border px-4 py-2">FROM</th>
                        <th className="border px-4 py-2">TO</th>
                        <th className="border px-4 py-2">AGENT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pnrs.map((pnr, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">
                            <NavLink
                              to={`/ztsPage/details-pnr-flight/${pnr?._id}`}
                            >
                              {pnr.bookingId}
                            </NavLink>
                          </td>
                          <td className="border px-4 py-2">{pnr.cchName}</td>
                          <td className="border px-4 py-2">{pnr.provider}</td>
                          <td className="border px-4 py-2">{pnr.status}</td>
                          <td className="border px-4 py-2">
                            {pnr?.departure
                              ? new Date(pnr.departure).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="border px-4 py-2">{pnr.from}</td>
                          <td className="border px-4 py-2">{pnr.to}</td>
                          <td className="border px-4 py-2">{pnr.AGENT}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GeneratePnrFlight;
