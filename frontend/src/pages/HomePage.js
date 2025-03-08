import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../CalendarStyles.css";
import AddEventModal from "../components/AddEventModal.js";
import CustomCalendarEvent from "../components/CustomCalendarEvent.js";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Set the start of the week to Monday
moment.updateLocale("en", { week: { dow: 1 } });
const localizer = momentLocalizer(moment);

const HomePage = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // State to track the current date
  const [events, setEvents] = useState([]); // State to track the list of events
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track if the modal is open
  const [selectedEvent, setSelectedEvent] = useState(null); // State to track the selected event

  // Handler to navigate to the previous month
  const handlePreviousMonth = () => {
    setCurrentDate((prev) => moment(prev).subtract(1, "month").toDate());
  };

  // Handler to navigate to the next month
  const handleNextMonth = () => {
    setCurrentDate((prev) => moment(prev).add(1, "month").toDate());
  };

  // Handler to navigate to the current date
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Handler to add a new event
  const handleAddEvent = (eventObj) => {
    console.log("Before transformation, eventObj:", eventObj);
    const transformedEvent = {
      ...eventObj,
      start: new Date(eventObj.startDateTime),
      end: new Date(eventObj.endDateTime)
    };
    console.log("Transformed event:", transformedEvent);
    setEvents((prevEvents) => [...prevEvents, transformedEvent]);
  };

  // Fetch events from the server when the user is available
  useEffect(() => {
    if (user) {
      fetch("http://localhost:4000/api/events", {
        method: "GET",
        credentials: "include",
      })
        .then(res => res.json())
        .then((data) => {
          const transformed = data.events.map(evt => ({
            ...evt,
            start: new Date(evt.startDateTime),
            end: new Date(evt.endDateTime)
          }));
          setEvents(transformed);
        })
        .catch((error) => console.error("Error fetching events:", error));
    }
  }, [user]);

  // Handler to select an event
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Handler to update an existing event
  const handleUpdateEvent = (updatedEvent) => {
    const transformedEvent = {
      ...updatedEvent,
      start: new Date(updatedEvent.startDateTime),
      end: new Date(updatedEvent.endDateTime)
    };
    setEvents((prevEvents) =>
      prevEvents.map((evt) =>
        evt.id === transformedEvent.id ? transformedEvent : evt
      )
    );
    console.log("Updated event transformed:", transformedEvent);
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
          key={events.length}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month"]}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(moment(date).toDate())}
          onSelectEvent={handleSelectEvent}
          popup
          popupOffset={{ x: 0, y: 0 }} 
          formats={{
            dayHeaderFormat: (date) => moment(date).format("DD")
          }}
          components={{
            toolbar: () => null,
            event: CustomCalendarEvent,
          }}
        />
      </div>
      <div id="popup-container" />

      {/* Add Event Modal */}
      {isModalOpen && (
        <AddEventModal
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          onSave={selectedEvent ? handleUpdateEvent : handleAddEvent}
        />
      )}
    </div>
  );
};

export default HomePage;
