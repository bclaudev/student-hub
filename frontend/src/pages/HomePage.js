import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Sidebar from '../components/Sidebar.js';
import AddEventModal from "../components/AddEventModal.js";
import CustomCalendarEvent from "../components/CustomCalendarEvent.js";
import '../CalendarStyles.css';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

moment.updateLocale("en", {
  week: {
    dow: 1,
  },
});

const localizer = momentLocalizer(moment);

const HomePage = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarMinimized((prev) => !prev);
  };

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => moment(prev).subtract(1, "month").toDate());
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => moment(prev).add(1, "month").toDate());
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleAddEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <div className="flex">
      <Sidebar isSidebarMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${isSidebarMinimized ? "minimized" : ""}`}>
        <div className="flex items-center justify-between" style={{ height: "69px" }}>
          <div className="flex items-center space-x-8">
            <h1 className="text-[20px] font-semibold pl-[32px]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Calendar
            </h1>
            <button
              onClick={handleToday}
              className="text-[14px] font-normal rounded-[4px]"
              style={{
                fontFamily: "'Inter', sans-serif",
                border: "1px solid #E9EBEF",
                width: "61px",
                height: "37px",
              }}>
                Today
            </button>
            <button onClick={handlePreviousMonth} className="px-2">
              <FaChevronLeft size={16} />
            </button>

            <button onClick={handleNextMonth} className="px-2">
              <FaChevronRight size={16} />
            </button>

            <span className="text-[20px] font-normal text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
              {moment(currentDate).format("MMMM YYYY")}
            </span>
          </div>
          <div className="flex justify-end pr-[32px]">
            <button
              className="w-auto h-[40px] flex items-center justify-center gap-[10px] px-[32px] py-[10px] rounded-[25px] bg-[#A585FF] text-white hover:bg-[#8060DB]"
              onClick={() => setIsModalOpen(true)}
            >
              Add New Event
            </button>
          </div>
        </div>

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          onNavigate={(date) => setCurrentDate(moment(date).toDate())}
          style={{ height: "calc(100vh - 100px)" }}
          components={{
            toolbar: () => null,
            event: CustomCalendarEvent,
          }}
        />

        {isModalOpen && (
          <AddEventModal 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleAddEvent} 
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
