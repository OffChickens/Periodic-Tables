import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import { updateReservation, readReservation } from "../utils/api";
import ReservationForm from "./ReservationForm.js";
import "./ReservationForm.css";

function ReservationEdit () {
    const history = useHistory();
    const {reservation_id} = useParams();
    const [errors, setErrors] = useState([]);
    //Initial state of the form
    const formData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
    };
    const [reservation, setReservation] = useState({...formData});

    //Function to validate the reservation, ensuring that it has a properly formatted date and time. Reservations cannot be made on a previous day, or previous time on the current day. They also must be made when the restaurant is open.
    function validateReservation(formData) {
        const { reservation_date, reservation_time } = formData;
        const errors = [];
      
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

    useEffect(() => {
        const controller = new AbortController();
        readReservation(reservation_id, controller.signal)
            .then(setReservation)
            .catch(setErrors);

            return () => controller.abort();
    }, [reservation_id]);

    //Handler for when the fields in the form are changed, ensuring that people remains a number
    const handleChange = (event) => {
        const {name, value} = event.target;
        if (name === "people") {
            setReservation({
                ...reservation, [name]: Number([value]),
            });
        } else {
            setReservation({
                ...reservation,
                [name]: value,
            });
        }
    };

    //Handler for the submission of the form to alter/update the given reservation, still containing all validation
    const handleSubmit = async (event) => {
        event.preventDefault();
        const controller = new AbortController();

        const resErrors = validateReservation(reservation);
        if (errors.length) {
            return setErrors(resErrors);
        }

        try {
            console.log(reservation)
            await updateReservation(reservation, controller.signal);
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        } catch (error) {
            setErrors(errors.map(error => error.message));
        }
        return () => controller.abort();
    };

    return (
        <>
            <div className="form_title">Edit reservation:</div>
            <ReservationForm handleSubmit={handleSubmit} handleChange={handleChange} errors={errors} reservation={reservation} />
        </>
    )

}

export default ReservationEdit