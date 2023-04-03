import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch } from 'react-redux';

/* Fonts */
import "@fontsource/inter";

/* CSS */
import './assets/css/style.css';

/* Actions */
import { getInvoices } from './actions/invoices';
import { getClients } from './actions/clients';
import { getProjects } from './actions/projects';

/* Components */
import Navigation from './components/Navigation';
import Home from './components/Home';
import InvoiceDetails from './components/InvoiceDetails';
import ProjectDetails from './components/ProjectDetails';
import InvoiceCreator from './components/InvoiceCreator/InvoiceCreator';
import { Toaster } from './components/ui/toaster.tsx';

/* Font awesome */
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

library.add(fas, far);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInvoices());
    dispatch(getClients());
    dispatch(getProjects());
  }, [dispatch])
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Navigation /> }>
            <Route path='/' element={<Navigate to='/home' replace />} />
            <Route path='/home' element={<Home />} />
            <Route path='/invoices' element={<InvoiceCreator />} />
            <Route path='/invoices/:id' element={<InvoiceDetails />} />
            <Route path='/projects/:id' element={<ProjectDetails />} />
            <Route path='/clients' element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
