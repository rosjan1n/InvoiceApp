import { combineReducers } from "redux";

import invoices from "./invoices";
import projects from "./projects";
import clients from "./clients";

export default combineReducers({ invoices, projects, clients });