/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL = "postgres://xurbnfnr:vuFJ4-zfrrV3wuH3wwEH1IEqcGUEGN5s@chunee.db.elephantsql.com/xurbnfnr",
  DATABASE_URL_DEVELOPMENT = "postgres://unsewqja:klr3cHaWMGIk_PIet4z3ANu3Flz14Xcz@chunee.db.elephantsql.com/unsewqja",
  DATABASE_URL_TEST = "postgres://zllnyqdr:BDU9nQ3fgxTx3qSKOds0QgpslUuvIFTR@chunee.db.elephantsql.com/zllnyqdr",
  DATABASE_URL_PREVIEW = "postgres://erjqmvij:mHEO0hzHb3sOuxgMCUEgmwLpf2UKuqVS@chunee.db.elephantsql.com/erjqmvij",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
