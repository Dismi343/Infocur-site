import ScrollToTop from "./components/ScrollToTop";
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home.jsx';
import BookingPage from './pages/Booking';
import TeamPage from './pages/TeamPage';
import Login from './pages/Login';
import SigninPage from './pages/SignInPage';
import Dashboard from "./pages/Dashboard.jsx";
import BookingInstructions from './pages/BookingInstructions.jsx';
import BookingEvent from './pages/BookingEvent.jsx';
import ClientBookings from './pages/ClientBookings.jsx';
import UploadSlip from './pages/UploadSlip.jsx';
import TrackBooking from "./pages/TrackBooking.jsx";
import UpdateProfile from "./pages/UpdateProfile.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path='/account' element={<Login/>} />   
        <Route path='/signin' element={<SigninPage/>} />
        <Route path='/dashboard' element={<Dashboard/>} />

        <Route path='/booking-instructions' element={<BookingInstructions/>}/>
        <Route path='/booking-event' element={<BookingEvent/>}/>
        <Route path='/your-bookings' element={<ClientBookings/>}/>
        <Route path='/upload-slip' element={<UploadSlip/>}/>
        <Route path='/track-booking' element={<TrackBooking/>}/>
        <Route path='/update-profile' element={<UpdateProfile/>}/>
        <Route path='/change-password' element={<ChangePassword/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        </Routes>
    </Router>
    </>
  );
};

export default App;
