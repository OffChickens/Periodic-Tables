import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import { createReservation } from "../utils/api";
import "./ReservationForm.css";
import ReservationForm from "./ReservationForm";

function ReservationNew () {
    const history = useHistory();
    const [errors, setErrors] = useState([]);
    //Initial form state
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    });

    const validMobile = (number) =>
      /^(?:\d{3}-\d{3}-\d{4}|\d{10})$/.test(number);

    //Handler for the submit button. Goes through the validation of the reservation and creates a new reservation, pushing the user to the dashboard for the date of the new reservation
    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validateReservation(formData);

        if (!validMobile(formData.mobile_number)) {
          return setErrors(["Invalid mobile_number format. It should be a 10-digit number with or without dashes."]);
        }
      
        if (errors.length === 0) {
          try {
            const newReservation = await createReservation( formData );
            if (newReservation) {
              const formattedDate = newReservation.reservation_date.split("T")[0];
              history.push(`/dashboard?date=${formattedDate}`);
            }
          } catch (error) {
            console.error("Error creating reservation:", error);
          }
        } else {
          setErrors(errors.map(error => error.message));
        }
      }
      
      //Function to validate the reservation, ensuring that it has a properly formatted date and time. Reservations cannot be made on a previous day, or previous time on the current day. They also must be made when the restaurant is open.
      function validateReservation(formData) {
        const { reservation_date, reservation_time } = formData;
        const errors = [];
        console.log(reservation_time)
        console.log(reservation_date)
      
        const day = new Date(reservation_date).getUTCDay();
        if (day === 2) {
          errors.push(new Error("Restaurant is closed on Tuesdays"));
        }
      
        // No reservations in the past
        const formattedDate = new Date(`${reservation_date}T${reservation_time}`);
        if (formattedDate < new Date()) {
          errors.push(new Error("Reservation must be in the future"));
        }
      
        // No reservations before 10:30AM or after 9:30PM
        const hours = Number(reservation_time.split(":")[0]);
        const minutes = Number(reservation_time.split(":")[1]);
        if (hours < 10 || (hours === 10 && minutes < 30)) {
          errors.push(new Error("Reservation must be after 10:30AM"));
        }
        if (hours > 21 || (hours === 21 && minutes > 30)) {
          errors.push(new Error("Reservation must be before 9:30PM"));
        }
      
        return errors;
      }

    //Handler for the altering/changing of the form
    const handleChange = (event) => {
      const {name, value} = event.target
      if (event.target.name === "people") {
        setFormData ({
            ...formData, [name]: Number(value),
        });
    } else {
        setFormData ({
            ...formData, [name]: value
        });
    }
    };


    return (
        <>
        <div className="form_title">Create a reservation:</div>
        <ReservationForm handleSubmit={handleSubmit} handleChange={handleChange} errors={errors} reservation={formData}/>
        </>
    )
}

export default ReservationNew;