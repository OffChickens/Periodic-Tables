const knex = require("../db/connection");

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

function list(reservation_date) {
    return knex("reservations")
    .select("*")
    .where({reservation_date})
    .whereNot({status: "finished" })
    .andWhereNot({ status: "cancelled" })
    .orderBy("reservation_time");
}

async function read(reservation_id) {
    try {
      const reservation = await knex("reservations")
        .select("*")
        .where("reservation_id", reservation_id)
        .first();
  
      return reservation;
    } catch (error) {
      // Handle any errors, e.g., database errors
      throw error;
    }
  }

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

function update(updated_reservation) {
    return knex("reservations")
        .select("*")
        .where({reservation_id: updated_reservation.reservation_id})
        .update(updated_reservation, "*")
        .then((createdRecords) => createdRecords[0]);
}

function updateStatus(reservation_id, status) {
    return knex("reservations")
    .select("*")
    .where({reservation_id})
    .update({status: status}, "*")
    .then((createdRecords) => createdRecords[0]);
}

module.exports = {
    create,
    list,
    read,
    search,
    update,
    updateStatus,
}