import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import {useLocation} from "react-router-dom";

function EventCreationSession() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [isIndoorEnabled, setIsIndoorEnabled] = useState(false);
  const [isOutdoorEnabled, setIsOutdoorEnabled] = useState(false);
  const [indoorSlotDuration, setIndoorSlotDuration] = useState(0);
  const [indoorInterval, setIndoorInterval] = useState(5);
  const [StartTime, setStartTime] = useState("08:00");
  const [indoorSlotCount, setIndoorSlotCount] = useState(0);
  const [indoorEndTime, setIndoorEndTime] = useState("");
  const [indoorMaxSlots, setIndoorMaxSlots] = useState(1);

  const [outdoorSlotDuration, setOutdoorSlotDuration] = useState(0);
  const [outdoorInterval, setOutdoorInterval] = useState(5);
  const [outdoorSlotCount, setOutdoorSlotCount] = useState(0);
  const [outdoorEndTime, setOutdoorEndTime] = useState("");
  const [outdoorMaxSlots, setOutdoorMaxSlots] = useState(1);

  const [formData, setFormData] = useState({
    eventName:'',
    date:'',
    startTime:'',
    indoor:{
      sessionDuration:'',
      sessionCount:''
    },
    outdoor:{
      sessionDuration:'',
      sessionCount:''
    }
  });

  const location = useLocation();

  const dayEndTime = "23:59";

  useEffect(() => {
      console.log("from event creation", location.state.selectedDate,"name :", location.state.eventName);
  }, []);

  useEffect(() => {
    if (StartTime) {
      const [startH, startM] = StartTime.split(":").map(Number);
      const [endH, endM] = dayEndTime.split(":").map(Number);

      const start = new Date();
      start.setHours(startH, startM, 0, 0);

      const end = new Date();
      end.setHours(endH, endM, 0, 0);

      const availableMinutes = (end - start) / 60000;
      const slotWithBuffer = indoorSlotDuration + indoorInterval;

      const possibleSlots = Math.floor(availableMinutes / slotWithBuffer);
      const safeSlots = possibleSlots > 0 ? possibleSlots : 1;

      setIndoorMaxSlots(safeSlots);
      if (indoorSlotCount > safeSlots) {
        setIndoorSlotCount(safeSlots);
      }

      const finalTime = new Date(start.getTime() + slotWithBuffer * indoorSlotCount * 60000);
      setIndoorEndTime(finalTime.toTimeString().slice(0, 5));
    }
  }, [indoorSlotDuration, indoorInterval, StartTime, indoorSlotCount]);

  useEffect(() => {
    if (StartTime) {
      const [startH, startM] = StartTime.split(":").map(Number);
      const [endH, endM] = dayEndTime.split(":").map(Number);

      const start = new Date();
      start.setHours(startH, startM, 0, 0);

      const end = new Date();
      end.setHours(endH, endM, 0, 0);

      const availableMinutes = (end - start) / 60000;
      const slotWithBuffer = outdoorSlotDuration + outdoorInterval;

      const possibleSlots = Math.floor(availableMinutes / slotWithBuffer);
      const safeSlots = possibleSlots > 0 ? possibleSlots : 1;

      setOutdoorMaxSlots(safeSlots);
      if (outdoorSlotCount > safeSlots) {
        setOutdoorSlotCount(safeSlots);
      }

      const finalTime = new Date(start.getTime() + slotWithBuffer * outdoorSlotCount * 60000);
      setOutdoorEndTime(finalTime.toTimeString().slice(0, 5));
    }
  }, [outdoorSlotDuration, outdoorInterval, StartTime, outdoorSlotCount]);



  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      eventName:location.state.eventName,
      date:location.state.selectedDate,
      startTime: StartTime + (StartTime.length === 5 ? ":00" : ""),
      indoor:{
        sessionDuration:indoorSlotDuration,
        interval:indoorInterval,
        sessionCount:indoorSlotCount
      },
      outdoor:{
        sessionDuration:outdoorSlotDuration,
        interval:outdoorInterval,
        sessionCount:outdoorSlotCount
      }
    })
    setShowModal(true); // Show modal instead of submitting immediately

  };

  const handleConfirmSubmit = () => {
  const payload = {
    indoor: isIndoorEnabled
      ? {
          slotDuration: indoorSlotDuration,
          interval: indoorInterval,
          startTime: StartTime,
          slotCount: indoorSlotCount,
          endTime: indoorEndTime,
        }
      : null,
    outdoor: isOutdoorEnabled
      ? {
          slotDuration: outdoorSlotDuration,
          interval: outdoorInterval,
          startTime: StartTime,
          slotCount: outdoorSlotCount,
          endTime: outdoorEndTime,
        }
      : null,

  };

console.log("formData", formData);
  console.log("Submitted payload:", payload);
  // Redirect to package creation (update route as needed)
  navigate('/package-creation',{state:{formData:formData}});
};


  return (
    <form onSubmit={handleSubmit} className="flex justify-center mx-auto gap-10 bg-gray-300 p-6 font-sora">
      {/* Indoor Section */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-medium">INDOOR</span>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isIndoorEnabled} onChange={() => setIsIndoorEnabled(!isIndoorEnabled)} className="sr-only peer" />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className={`p-6 rounded-lg w-[400px] bg-white transition duration-200 ${isIndoorEnabled ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none"}`}>
          <div className="flex flex-col mx-auto">
            <label className="block mb-2 font-medium">Time Slot Duration</label>
            <select className="mb-4 border p-2 rounded" value={indoorSlotDuration} onChange={(e) => setIndoorSlotDuration(parseInt(e.target.value))}>
              <option value={0}>0 min</option>
              <option value={20}>20 min</option>
              <option value={30}>30 min</option>
              <option value={40}>40 min</option>
              <option value={50}>50 min</option>
            </select>

            <label className="block mb-2 font-medium">Interval</label>
            <select className="mb-4 border p-2 rounded" value={indoorInterval} onChange={(e) => setIndoorInterval(parseInt(e.target.value))}>
              <option value={5}>5 min</option>
              <option value={10}>10 min</option>
              <option value={15}>15 min</option>
            </select>

            <label className="block mb-2 font-medium">Starting Time</label>
            <TimePicker
              onChange={setStartTime}
              value={StartTime}
              disableClock={true}
              className="p-2 border rounded mb-4"
              format="hh:mm a"
            />

            <label className="block mb-2 font-medium">No of Time Slots (Max {indoorMaxSlots})</label>
            <select className="mb-4 border p-2 rounded" value={indoorSlotCount} onChange={(e) => setIndoorSlotCount(parseInt(e.target.value))}>
              {Array.from({ length: indoorMaxSlots }, (_, i) => <option key={i } value={i }>{i }</option>)}
            </select>

            {indoorEndTime && (
              <p className="mt-4 text-sm font-medium text-gray-800">Ending Time: <span className="font-bold">{indoorEndTime}</span></p>
            )}
          </div>
        </div>
      </div>

      {/* Outdoor Section */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-medium">OUTDOOR</span>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isOutdoorEnabled} onChange={() => setIsOutdoorEnabled(!isOutdoorEnabled)} className="sr-only peer" />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className={`p-6 rounded-lg w-[400px] bg-white transition duration-200 ${isOutdoorEnabled ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none"}`}>
          <div className="flex flex-col mx-auto">
            <label className="block mb-2 font-medium">Time Slot Duration</label>
            <select className="mb-4 border p-2 rounded" value={outdoorSlotDuration} onChange={(e) => setOutdoorSlotDuration(parseInt(e.target.value))}>
              <option value={0}>0 min</option>
              <option value={20}>20 min</option>
              <option value={30}>30 min</option>
              <option value={40}>40 min</option>
              <option value={50}>50 min</option>
            </select>

            <label className="block mb-2 font-medium">Interval</label>
            <select className="mb-4 border p-2 rounded" value={outdoorInterval} onChange={(e) => setOutdoorInterval(parseInt(e.target.value))}>
              <option value={0}>0 min</option>
              <option value={5}>5 min</option>
              <option value={10}>10 min</option>
              <option value={15}>15 min</option>
            </select>

            <label className="block mb-2 font-medium">Starting Time</label>
            <TimePicker
                onChange={setStartTime}
                value={StartTime}
                disableClock={true}
                className="p-2 border rounded mb-4"
                format="hh:mm a"
              />

            <label className="block mb-2 font-medium">No of Time Slots (Max {outdoorMaxSlots})</label>
            <select className="mb-4 border p-2 rounded" value={outdoorSlotCount} onChange={(e) => setOutdoorSlotCount(parseInt(e.target.value))}>
              {Array.from({ length: outdoorMaxSlots }, (_, i) => <option key={i } value={i }>{i}</option>)}
            </select>

            {outdoorEndTime && (
              <p className="mt-4 text-sm font-medium text-gray-800">Ending Time: <span className="font-bold">{outdoorEndTime}</span></p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-end">
        <button type="submit" className="h-12 px-6 py-2 mt-6 font-bold text-white bg-blue-600 rounded shadow hover:bg-blue-700">Submit</button>
      </div>
            {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate-fade-in-down">
                <h2 className="text-xl font-bold mb-4">Create Session?</h2>
                <p className="mb-6 text-sm text-gray-600">Are you sure you want to create this session? You will be redirected to package creation after this.</p>
                <div className="flex justify-end gap-4">
                    <button
                    className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
                    onClick={() => setShowModal(false)}
                    >
                    Cancel
                    </button>
                    <button
                    className="px-4 py-2 bg-[#2A8ACE] text-white rounded hover:bg-blue-700"
                    onClick={handleConfirmSubmit}
                    >
                    Create
                    </button>
                </div>
                </div>
            </div>
            )}
    </form>
    
  );
}

export default EventCreationSession;