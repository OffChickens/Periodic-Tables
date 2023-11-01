import React, {useState} from "react";
import { createTable } from "../utils/api";
import {useHistory} from "react-router-dom";
import "../reservations/ReservationForm.css";

function TableForm () {

    //Initial form state
    const initialFormState = {
        table_name: "",
        capacity: 0,
    };
    const [table, setTable] = useState({...initialFormState});
    const [errors, setErrors] = useState([])
    const history = useHistory();

    //Change handler for the table form 
    const handleChange = (event) => {
        const {name, value} = event.target;
        if (event.target.name === "capacity") {
            setTable ({
                ...table, [name]: Number(value),
            });
        } else {
            setTable ({
                ...table, [name]: value
            });
        }
    };

    //Submit handler for the table form, adding the table to the database (with no errors) and pushing the user to the dashboard
    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();

        createTable(table, abortController.signal)
            .then((response) => {
                console.log(response);
                history.push(`/dashboard`)
            })
            .catch(setErrors);

        return () => abortController.abort();
    };

    return (
        <>
            <h1>New Table</h1>
            <form onSubmit={handleSubmit}>
                <div className="form_item">
                    <label className="form_label" htmlFor="table_name">Table Name</label>
                    <input className="form_input" type="text" name="table_name" id="table_name" required={true} value={table.table_name} minLength="2" onChange={handleChange}/>
                </div>
                <div className="form_item">
                    <label className="form_label" htmlFor="capacity">Capacity</label>
                    <input className="form_input"type="number" name="capacity" id="capacity" required={true} value={table.capacity} min={1} onChange={handleChange}/>
                </div>
                <div>
                    <button className="form_btn" type="button" onClick={() => history.goBack()}>Cancel</button>
                    <button className="form_btn" type="submit">Submit</button>
                </div>
            </form>
            {errors.length > 0 && (
                <div className="alert alert-danger">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
        </>
    )
}

export default TableForm;