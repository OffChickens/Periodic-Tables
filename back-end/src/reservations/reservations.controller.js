/**
 * List handler for reservation resources
 */
const reservationService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

//List of properties required
const hasProps = hasProperties(
  "first_name", 
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

//List of valid properties
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

//Function to ensure that all properties are valid
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

//Functions to ensure that the date and time of the reservation are valid. Date cannot be a Tuesday
function hasValidDate(req, res, next) {
  const { data = {} } = req.body;
  const date = data["reservation_date"];
  const time = data["reservation_time"];
  const formattedDate = new Date(`${date}T${time}`);
  const day = new Date(date).getUTCDay();

  if (isNaN(Date.parse(data["reservation_date"]))) {
    return next({
      status: 400,
      message: `Invalid reservation_date`,
    });
  }
  if (day === 2) {
    return next({
      status: 400,
      message: `Restaurant is closed on Tuesdays`,
    });
  }
  if (formattedDate <= new Date()) {
    return next({
      status: 400,
      message: `Reservation must be in the future`,
    });
  }
  next();
}

//Ensures that the format of the time is valid (both 00:00:00 and 00:00)
function hasValidTime(req, res, next) {
  const { data = {} } = req.body;
  const time = data["reservation_time"];

  if (!/^([0-1][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/.test(time)) {
    next({
      status: 400,
      message: `Invalid reservation_time`,
    });
  }

  const hours = Number(time.split(":")[0]);
  const minutes = Number(time.split(":")[1]);
  if (hours < 10 || (hours === 10 && minutes < 30)) {
    next({
      status: 400,
      message: `Reservation must be after 10:30AM`,
    });
  }
  if (hours > 21 || (hours === 21 && minutes > 30)) {
    next({
      status: 400,
      message: `Reservation must be before 9:30PM`,
    });
  }
  next();
}

/********************************************************************************/

function hasValidNumber(req, res, next) {
  const { data = {} } = req.body;
  const people = data["people"];

  if (people === 0 || typeof people !== "number" || isNaN(people)) {
    return next({
      status: 400,
      message: "Invalid number of people",
    });
  }
  next();
}

//Function to ensure that the status of the reservation is one of the four valid ones
function hasValidStatus(req, res, next) {
  const validStatus = ["booked", "seated", "finished", "cancelled"];
  const {status} = req.body.data;
  const currentStatus = res.locals.reservation.status;

  if (currentStatus === "finished" || currentStatus === "cancelled") {
    return next({
      status: 400,
      message: "Reservation status is finished",
    });
  }
  if (validStatus.includes(status)) {
    res.locals.status = status;
    return next();
  }
  next({
    status: 400,
    message: `Invalid status: ${status}`,
  });
}

//Function to ensure that the status of a reservation is booked
function isBooked(req, res, next) {
  const { status } = req.body.data;

  if (status && status !== "booked") {
    return next({
      status: 400,
      message: `Invalid status: ${status}`,
    });
  }
  next();
}

//Function to ensure that a given reservation exists
async function reservationExists(req, res, next) {
  const reservation_id = 
    req.params.reservation_id || (req.body.data || {}).reservation_id;

    const reservation = await reservationService.read(reservation_id);
    if (reservation) {
      res.locals.reservation = reservation;
      return next();
    }
    next({
      status: 404,
      message: `Reservation ${reservation_id} cannot be found.`
    });
}

async function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

//Function to list all of the reservations for a given context (date/phone number)
async function list(req, res) {
  try {
    const date = req.query.date;
    const mobile_number = req.query.mobile_number;

    if (date) {
      // List reservations by date
      const data = await reservationService.list(date);
      res.json({ data });
    } else if (mobile_number) {
      // Search reservations by mobile number
      const data = await reservationService.search(mobile_number);
      res.json({ data });
    } else {
      const currentDate = new Date().toISOString().split('T')[0];
      const data = await reservationService.list(currentDate);
      res.json({ data });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

//Function to create a reservation
async function create(req, res) {
  const data = await reservationService.create(req.body.data);
  res.status(201).json({ data });
}

//Function to update a reservation
async function update (req, res) {
  const updated_reservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await reservationService.update(updated_reservation);
  res.status(200).json({ data });
}

//Function to update the status of a reservation
async function updateStatus(req, res) {
  const {status} = res.locals;
  const {reservation_id} = res.locals.reservation;
  const data = await reservationService.updateStatus(reservation_id, status);
  res.status(200).json({data});
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasOnlyValidProperties, hasProps, hasValidNumber, hasValidDate, hasValidTime, isBooked, asyncErrorBoundary(create)],
  read: [reservationExists, asyncErrorBoundary(read)],
  update: [hasOnlyValidProperties, hasProps, hasValidDate, hasValidTime, hasValidNumber, reservationExists, asyncErrorBoundary(update)],
  updateStatus: [
    reservationExists, hasValidStatus, asyncErrorBoundary(updateStatus),
  ],
  reservationExists,
};
