import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import ReservationNew from "../reservations/ReservationNew";
import ReservationSeat from "../reservations/ReservationSeat"
import TableForm from "../tables/TableForm"
import Search from "../reservations/ReservationSearch";
import ReservationEdit from "../reservations/ReservationEdit";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <ReservationSeat />
      </Route>
      <Route exact={true} path='/reservations/:reservation_id/edit'>
        <ReservationEdit />
      </Route>
      <Route exact={true} path="/reservations/new">
        <ReservationNew />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact path ="/dashboard/:date">
        <Dashboard />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route exact path="/tables/new">
        <TableForm />
      </Route>
      <Route exact={true} path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
