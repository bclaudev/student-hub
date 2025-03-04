import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../CalendarStyles.css";   // Keep your big-calendar overrides here
import AddEventModal from "../components/AddEventModal.js";
import CustomCalendarEvent from "../components/CustomCalendarEvent.js";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


moment.updateLocale("en", { week: { dow: 1 } });
const localizer = momentLocalizer(moment);

const HomePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="homepage-main-content">
      {/* Top Bar */}
      <div className="homepage-top-bar">
        <div className="flex items-center space-x-8">
          <h1 className="homepage-title">Calendar</h1>
          <button onClick={handleToday} className="today-button">
            Today
          </button>
          <button onClick={handlePreviousMonth} className="px-2">
            <FaChevronLeft size={16} />
          </button>
          <button onClick={handleNextMonth} className="px-2">
            <FaChevronRight size={16} />
          </button>

          <span className="month-label">
            {moment(currentDate).format("MMMM YYYY")}
          </span>
        </div>
        <div className="flex justify-end pr-[32px]">
          <button
            className="add-new-event-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Add New Event
          </button>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          onNavigate={(date) => setCurrentDate(moment(date).toDate())}
          components={{
            toolbar: () => null,
            event: CustomCalendarEvent,
          }}
        />
      </div>

      {isModalOpen && (
        <AddEventModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddEvent}
        />
      )}
    </div>
  );
};

export default HomePage;
