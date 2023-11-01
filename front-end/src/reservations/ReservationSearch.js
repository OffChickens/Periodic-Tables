import React, {useState} from "react";
import { listReservations } from "../utils/api";
import ReservationList from "./ReservationList";
import "./ReservationForm.css";

function Search() {
    const [reservations, setReservations] = useState([]);
    const [mobileNumber, setMobileNumber] = useState('');
    const [submitted, setSubmitted] = useState(false);

    //Change handler for the search bar
    const handleChange = (event) => {
        setMobileNumber(event.target.value);
    }

    //Submit handler, which gets the list of reservations for a given phone number
    const handleSubmit = async (event) => {
        event.preventDefault();
        const abortController = new AbortController();
    
        let res = await listReservations(
          { mobile_number: mobileNumber },
          abortController.signal
        );
        await setReservations(res);
        setSubmitted(true);
    
        return () => abortController.abort();
      };

    //Form and display of the reservations given a phone number. If there are no reservations for a given phone number, the form will display No reservations found.
    return (
        <>
            <h2>Search by Phone Number:</h2>
            <form onSubmit={handleSubmit}>
                <div className="form_item">
                    <input className="form_input hs-search-field__input" name="mobile_number" onChange={handleChange} />
                    <button className="form_btn" type="submit"><i className="fa fa-search"></i></button>
                </div>
            </form>
            {submitted ? (
                reservations.length === 0 ? (
                    <p>No reservations found.</p>
                ) : (
                <ReservationList reservations={reservations} />
                )
            ) : (
                <div></div>
            )}
        </>
    )
}

export default Search;