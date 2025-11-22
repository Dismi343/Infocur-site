import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Event from './pages/Event';
import Bookings from './pages/Bookings';
import Portfolio from './pages/Portfolio';
import Settings from './pages/Settings';
import Timeslots from './pages/Timeslots';
import Progress from './pages/Progress';
import EventEdit from "./pages/EventEdit"; // Added import for Edit page
import { useLocation } from 'react-router-dom';

import EventCreation from './pages/EventCreation';
import EventCreationSession from './pages/EventCreationSession';
import EventCreationPackage from './pages/EventCreationPackage';
import BookingDetails from "./pages/BookingDetails.jsx";
import ProgressEvents from "./pages/ProgressEvents.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";


function App() {

  const location = useLocation()

  return (
    <>

        {location.pathname !== "/" && <Navbar />}
        <Routes>
          
          {/*main routes*/}
          <Route path="/" element={<AdminLogin />} />
          <Route path="/dashboard" element={<Event />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/timeslots' element={<Timeslots />} />


          {/*Event Creation routes*/}
          <Route path='/event-creation' element={<EventCreation />} />
          <Route path='/session-creation' element={<EventCreationSession />} />
          <Route path='/package-creation' element={<EventCreationPackage />} />
          
          {/* Event Edit route */}
          <Route path='/event-edit/:id' element={<EventEdit />} />

          {/*Booking approval*/}
          <Route path='/booking-approval/:eventId' element={<BookingDetails />}/>

          {/*progress routes*/}
          <Route path='/progress-events' element={<ProgressEvents />} />
          <Route path='/progress/:eventId' element={<Progress />} />

        </Routes>

    </>
  );
};

export default function WrappedApp() {
  return (
      <Router>
        <App />
      </Router>
  );
}
