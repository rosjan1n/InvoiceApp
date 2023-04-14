import React from "react";
import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import App from "./App";

import authReducer from "./reducers/features/auth/authSlice";
import invoiceReducer from './reducers/features/invoices/invoiceSlice';
import clientReducer from './reducers/features/clients/clientSlice';
import projectReducer from './reducers/features/projects/projectSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    invoice: invoiceReducer,
    client: clientReducer,
    project: projectReducer
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);