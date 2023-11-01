import React from "react";
import {Link} from "react-router-dom";
import "../dashboard/Dashboard.css";

function ReservationList({reservations, handleCancel}) {


    /*The displayed version of the list of reservations for given context (data/phone number).
    * If the table is either seated or booked, it can be displayed on the dashboard.
    * If a reservation is booked, it will display a Seat button, bringing the user to the seat table page. Otherwise, it will simply display the status of the reservation.
    */
    const display = reservations.map((reservation) => {
        return <tr key={reservation.reservation_id}>
          <td>{reservation.reservation_id}</td>
          <td>{reservation.first_name}</td>
          <td>{reservation.last_name}</td>
          <td>{reservation.mobile_number}</td>
          <td>{reservation.people}</td>
          <td>{reservation.reservation_time}</td>
          <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
          {reservation.status !== "seated" && reservation.status !== "finished" && reservation.status !== "cancelled" ? 
          (<td>
            <Link className="button-link" to={`/reservations/${reservation.reservation_id}/seat`}>
              <button className="table_btn">
                Seat
              </button>
            </Link>
          </td>) :
          (<td>{reservation.status}</td>) }
          <td>
            <Link className="button-link" to={`/reservations/${reservation.reservation_id}/edit`}>
              <button className="table_btn">
                Edit
              </button>
            </Link>
          </td>
          <td>
            <button className="cancel_btn" type="button" value={reservation.reservation_id} data-reservation-id-cancel={reservation.reservation_id} onClick={handleCancel}>Cancel</button>
          </td>
        </tr>
      });

    return (
      <div style={{overflowX: 'auto'}}>
        <table className="content-table">
            <thead>
            <tr>
                <th>ID</th>
                <th>First</th>
                <th>Last</th>
                <th>Mobile #</th>
                <th>Guests</th>
                <th>Time</th>
                <th>Status</th>
                <th>Seat</th>
                <th>Edit</th>
                <th>Cancel</th>
            </tr>
            </thead>
            <tbody>{display}</tbody>
        </table>
      </div>
    )
}

export default ReservationList;