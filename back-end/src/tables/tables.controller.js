const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const resController = require("../reservations/reservations.controller");

//Ensures that the required properties are there
const hasProps = hasProperties("table_name", "capacity");
//Checks for a reservation ID
const hasResId = hasProperties("reservation_id");

//Function to ensure that a table exists
async function tableExists(req, res, next) { 
    const table_id = req.params.table_id;
    const table = await tablesService.read(table_id);
    if (table) {
        res.locals.table = table;
        return next();
    }
    next({status: 404, message: `Table ${table_id} cannot be found.`})
    
}

//Function to ensure that the table name is valid and greater than 2 characters
function hasValidName(req, res, next) {
    const table_name = req.body.data.table_name;

    if (table_name.length < 2) {
        return next({
            status: 400,
            message: "Invalid table_name",
        });
    }
    next();
}

//Function to ensure that a table has a capacity
function hasCapacity(req, res, next) {
    const capacity = req.body.data.capacity;

    if (typeof capacity !== "number" || capacity < 1 || isNaN(capacity)) {
        return next({
            status: 400,
            message: "Invalid capacity",
        });
    }
    next();
}

//Function to check if a table has enough capacity for a given reservation to be seated there
function hasSufficientCap(req, res, next) {
    const capacity = res.locals.table.capacity;
    const people = res.locals.reservation.people;

    if (capacity < people) {
        return next({
            status: 400,
            message: "Table has insufficient capacity.",
        });
    }
    next();
}

//Function to check if a table is free
function tableIsFree(req, res, next) {
    if (res.locals.table.is_occupied) {
        return next({
            status: 400,
            message: "Table is occupied",
        });
    }
    next();
}

function tableIsNotSeated(req, res, next) {
    if (res.locals.reservation.status === "seated") {
        return next({
            status: 400,
            message: "Table is already seated",
        });
    }
    next();
}


//Function to check if there is a reservation at a table
function isOccupied(req, res, next) {
    if (!res.locals.table.reservation_id) {
        return next({
            status: 400,
            message: "Table is not occupied"
        })
    }
    next();
}

//Function to list all tables
async function list(req, res) {
    const data = await tablesService.list();
    res.json({ data });
}

//Function to create a new table
async function create(req, res) {
    const data = await tablesService.create(req.body.data);
    res.status(201).json({ data })
}

//Function to update a table, particularly with a reservation being seated there
async function update(req, res) {
    const {reservation_id} = req.body.data;
    const data = await tablesService.update(reservation_id, res.locals.table.table_id);
    res.status(200).json({data});
}

//Function to finish a table, making it available and changing the status of the associated reservation
async function finish(req, res) {
    const data = await tablesService.finish(
      res.locals.table.reservation_id,
      res.locals.table.table_id
    );
    res.status(200).json({ data }); 
  }

module.exports = {
    list: asyncErrorBoundary(list),
    create: [hasProps, hasValidName, hasCapacity, asyncErrorBoundary(create)],
    update: [asyncErrorBoundary(tableExists), hasResId, resController.reservationExists, hasSufficientCap, tableIsNotSeated, tableIsFree, asyncErrorBoundary(update)],
    finish: [asyncErrorBoundary(tableExists), isOccupied, asyncErrorBoundary(finish)],
}