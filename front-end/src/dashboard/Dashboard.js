import React, { useEffect, useState } from "react";
import { finishTable, listReservations, listTables, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import "./Dashboard.css";
import { useLocation, useHistory } from "react-router-dom";
import ReservationList from "../reservations/ReservationList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
const today = new Date().toISOString().split("T")[0];



function Dashboard() {
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dateParam = queryParams.get("date");
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [date, setDate] = useState(dateParam || today);

  useEffect(loadDashboard, [date]);

  //Load Dashboard function getting the list of the reservations for the given date and loading the list of tables
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables().then(setTables).catch(setReservationsError);

    return () => abortController.abort();
  }

  //Function to handle the previous button, which would set the date to the previous date and push the page to that given date
  function handlePrevious() {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);
    setDate(currentDate.toISOString().split('T')[0]);
    history.push(`/dashboard?date=${currentDate.toISOString().split('T')[0]}`);
  }

  //Function to handle the today button, which would simply push to the dashboard with no given date (default)
  function handleToday() {
    setDate(today);
    history.push(`/dashboard`);
  }

  //Function to handle the next button, which would set the date to the next date and push the page to that given date
  function handleNext() {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    setDate(currentDate.toISOString().split('T')[0]);
    history.push(`/dashboard?date=${currentDate.toISOString().split('T')[0]}`);
  }

  //Function to handle the finish button which will ask the user to confirm whether they are certain that they want to perform the action and then reload the page afterward
  async function handleFinish(table_id) {
    const controller = new AbortController();
    const confirm = window.confirm("Is this table ready to seat new guests? This cannot be undone.");

    if (confirm) {
      await finishTable(table_id, controller.signal);
      window.location.reload();
    }
  }

  //Function to handle the cancel the reservation, which will ask the user to confirm whether they are certain that they want to perform the action, if so, set the status of the reservation to cancelled, removing it from the list and reload the page
  const handleCancel = async (event) => {
    const confirm = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );

    if (confirm) {
      console.log(event.target.value)
      await updateStatus(event.target.value, "cancelled");
      loadDashboard();
    }
  };

  //The table of tables to be displayed on the dashboard. If the table is currently occupied by a reservation (has reservation_id) it will display Occupied in the status along with a Finish button. Otherwise, the table will say Free and Unoccupied
  const tableDisplay = tables.map((table) => {
    return <tr key={table.table_id}>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      {table.reservation_id ? (
            <td data-table-id-status={table.table_id}>Occupied</td>
          ) : (
            <td data-table-id-status={table.table_id}>Free</td>
          )}
      {table.reservation_id ? (
        <td><button
          className="finish finish_btn"
          data-table-id-finish={table.table_id}
          onClick={() => handleFinish(table.table_id)}
        >
          Finish
        </button>
        </td>
      ) : (
        <td>Unoccupied</td>
      )}
    </tr>
  })

  let dates_reservations = reservations.filter((reservation) => reservation.reservation_date === date);

  return (
    <>
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>
        <button className="dash_btn" type="previous" onClick={handlePrevious}>Previous</button>
        <button className="dash_btn_tdy dash_btn" type="today" onClick={handleToday}>Today</button>
        <button className="dash_btn" type="next" onClick={handleNext}>Next</button>
      </div>
      {reservations.length === 0 ? (
        <h4>No Reservations for {date}</h4>
      ) : (
        <ReservationList reservations={dates_reservations} handleCancel={handleCancel}/>
      )}
      <div style={{overflowX: "auto"}}>
      <table className="content-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Capacity</th>
            <th>Occupied</th>
            <th>Finish Table</th>
          </tr>
        </thead>
        <tbody>
          {tableDisplay}
        </tbody>
      </table>
      </div>
    </main>
    </>
  );
}

export default Dashboard;
