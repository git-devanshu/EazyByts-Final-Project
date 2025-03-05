import { Spacer } from "@chakra-ui/react";
import React from "react";
import {FaMapMarkerAlt} from 'react-icons/fa';

const Ticket = ({ eventData, onClose, onDownload }) => {
  return (
    <div style={{height: 'auto', width: '300px', position: 'absolute', top: '30px', left: 'calc((100% - 300px)/2)', zIndex: 10, backgroundColor: '#212738', borderRadius: '10px', boxShadow: '0 2px 5px black', border: '1px solid #d7d7d7', padding: '10px 10px 10px 10px'}}>
      <div style={{ position:'relative', background: "#fff", borderRadius: "12px", overflow: "hidden", paddingBottom: "10px" }}>
        
        {/* Semicircle Cutouts */}
        <div style={{ position: "absolute", top: "50%", left: "-15px", width: "30px", height: "30px", background: "#212738", borderRadius: "50%", transform: "translateY(125px)" }}></div>
        <div style={{ position: "absolute", top: "50%", right: "-15px", width: "30px", height: "30px", background: "#212738", borderRadius: "50%", transform: "translateY(125px)" }}></div>

        <img src={eventData.bookingFor.eventPosterURL} style={{ height: "160px", borderTopLeftRadius: "12px", borderTopRightRadius: "12px", width: '100%' }}/>
        <p style={{ fontSize: "18px", margin: "10px 0", color: "black", fontWeight: '500', textAlign: 'center' }}>{eventData._id}</p>
        <h2 style={{ color: "#3CB5FB", margin: "5px 0", fontSize: '20px', fontWeight: '500', textAlign: 'center' }}>{eventData.bookingFor.eventName}</h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
          <FaMapMarkerAlt className="icon" style={{color: '#3cb5fb', marginRight: '0'}}/>
          <p style={{ fontSize: "16px", color: "black" }}>{eventData.bookingFor.eventLocation}</p>
        </div>

        <hr style={{ width: "90%", margin: "10px auto", border: "0.5px solid #ccc" }} />
        <div style={{ fontSize: "16px", margin: "5px 0", color: "black", display: 'flex', paddingLeft: '15px', paddingRight: '15px'}}>Date: <Spacer/> {eventData.bookingFor.eventDate}</div>
        <div style={{ fontSize: "16px", margin: "5px 0", color: "black", display: 'flex', paddingLeft: '15px', paddingRight: '15px' }}>Quantity: <Spacer/> {eventData.totalTicketsBooked} tickets</div>
        <div style={{ fontSize: "16px", margin: "5px 0", color: "black", display: 'flex', paddingLeft: '15px', paddingRight: '15px' }}>Name: <Spacer/> {eventData.bookingBy.name}</div>
        <hr style={{ width: "90%", margin: "10px auto", border: "0.5px solid #ccc" }} />

        <p style={{ fontSize: "18px", margin: "10px 0", color: "black", fontWeight: '500', textAlign: 'center' }}>{eventData._id}</p>
        <h3 style={{ fontSize: "20px", margin: "10px 0", color: "black", fontWeight: '500', textAlign: 'center' }}>Total Amount <b>Rs. {eventData.totalCost}</b></h3>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
        <button onClick={onDownload} className="view-btn">Download</button>
        <button onClick={onClose} className="bookmark-btn">Close</button>
      </div>
    </div>
  );
};

export default Ticket;
