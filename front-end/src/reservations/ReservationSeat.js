import React, {useState, useEffect} from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, updateTable, readReservation } from "../utils/api";
import "./ReservationForm.css";

function ReservationSeat() {
    const {reservation_id} = useParams();
    const [tables, setTables] = useState([]);
    const [tableId, setTableId] = useState("");
    const [reservation, setReservation] = useState({});
    const history = useHistory();

    //Gets the list of tables upon navigating to the page
    useEffect(() => {
        listTables()
          .then((data) => setTables(data))
          .catch((error) => console.error("Error loading tables: ", error));
      }, []);

    
    useEffect(() => {
        readReservation(reservation_id)
            .then(setReservation)
    }, [reservation_id]);

    //Change handler for the selector
    const handleChange = (event) => {
        setTableId(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
      
        try {
          await updateTable(reservation_id, tableId);
          history.push("/dashboard");
        } catch (error) {
          console.error("Error while seating reservation:", error);
        }
      };

    //List of tables for the selector
    const tableOptions = tables.map((table) => (
        <option key={table.table_id} value={table.table_id} disabled={table.capacity < reservation.people || table.occupied}>{table.table_name} - {table.capacity}</option>
    ))

    return (
        <>
            <h2>Select a Table:</h2>
            <form onSubmit={handleSubmit}>
                <div className="form_item">
                    <select className="form_input" name="table_id" value={tableId} onChange={handleChange}>
                        <option value="">Table Number</option>
                        {tableOptions}
                    </select>
                </div>
                <div className="form_item">
                    <div>
                        <button className="form_btn" type="button" onClick={() => history.goBack()}>Cancel</button>
                        <button className="form_btn" type="submit">Submit</button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default ReservationSeat;