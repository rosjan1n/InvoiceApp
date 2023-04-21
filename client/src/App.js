import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

/* Fonts */
import "@fontsource/inter";

/* CSS */
import './assets/css/style.css';

/* Components */
import Navigation from './components/Navigation';
import Home from './components/Home';
import InvoiceDetails from './components/InvoiceDetails';
import ProjectDetails from './components/ProjectDetails';
import InvoiceCreator from './components/InvoiceCreator/InvoiceCreator';
import ProjectCreator from './components/ProjectCreator/ProjectCreator';
import ClientCreator from './components/ClientCreator/ClientCreator';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Settings from './components/Settings.js';
import { Toaster } from './components/ui/toaster.tsx';

/* Font awesome */
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fas, far, fab);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Navigation /> }>
            <Route path='/' element={<Navigate to='/home' replace />} />
            <Route path='/home' element={<Home />} />
            <Route path='/signin' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/projects' element={<ProjectCreator />} />
            <Route path='/invoices' element={<InvoiceCreator />} />
            <Route path='/clients' element={<ClientCreator />} />
            <Route path='/invoices/:id' element={<InvoiceDetails />} />
            <Route path='/projects/:id' element={<ProjectDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
