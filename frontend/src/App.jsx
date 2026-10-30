import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ParentDashboard from "./pages/ParentDashboard";
import FindChildcare from "./pages/FindChildcare";
import ChildcareDetails from "./pages/ChildcareDetails";
import Booking from "./pages/Booking";
import Bookings from "./pages/Bookings";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/parent-dashboard"
          element={<ParentDashboard />}
        />
<Route
  path="/provider-dashboard"
  element={<ProviderDashboard />}
/>
<Route
  path="/admin-dashboard"
  element={<AdminDashboard />}
/>
        <Route
          path="/find-childcare"
          element={<FindChildcare />}
        />
        <Route
  path="/booking/:id"
  element={<Booking />}
/>
<Route
  path="/bookings"
  element={<Bookings />}
/>
<Route
  path="/childcare/:id"
  element={<ChildcareDetails />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;