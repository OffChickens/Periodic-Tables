import React from "react";
import { useHistory } from "react-router-dom";
import "./ReservationForm.css"

function ReservationForm({handleSubmit, handleChange, errors, reservation}) {
    const history = useHistory();


    //Form for reservations to be used by both the ReservationEdit and ReservationNew components. Each will contain their own way of handling the submission and the Edit component will fill the form with the data to be editted
    return (
        <><form onSubmit={handleSubmit}>
            <div className="form_item">
                <label className="form_label" htmlFor="first_name">First Name</label>
                <input className="form_input" type="text" name="first_name" id="first_name" value={reservation.first_name} placeholder="Enter First Name" onChange={handleChange} />
            </div>
            <div className="form_item">
                <label className="form_label" htmlFor="last_name">Last Name</label>
                <input className="form_input" type="text" name="last_name" id="last_name" value={reservation.last_name} placeholder="Enter Last Name" onChange={handleChange} />
            </div>
            <div className="form_item">
                <label className="form_label" htmlFor="mobile_number">Mobile Number</label>
                <input className="form_input" type="text" name="mobile_number" id="mobile_number" value={reservation.mobile_number} placeholder="Enter Mobile Number " onChange={handleChange} />
            </div>
            <div className="form_item">
                <label className="form_label" htmlFor="reservation_date">Date of reservation</label>
                <input className="form_input form_input--small" type="date" name="reservation_date" id="reservation_date" value={reservation.reservation_date} placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" onChange={handleChange} />
            </div>
            <div className="form_item">
                <label className="form_label" htmlFor="reservation_time">Time of reservation</label>
                <input className="form_input form_input--small" type="time" name="reservation_time" id="reservation_time" value={reservation.reservation_time} placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}" onChange={handleChange} />
            </div>
            <div className="form_item">
                <label className="form_label" htmlFor="people">Number of people</label>
                <input className="form_input form_input--small" type="text" name="people" id="people" value={reservation.people} placeholder="Enter Number of Guests" onChange={handleChange} />
            </div>
            <div className="form_item">
                <div>
                    <button className="form_btn"type="button" onClick={() => history.goBack()}>Cancel</button>
                    <button className="form_btn submit_btn" type="submit">Submit</button>
                </div>
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

export default ReservationForm;