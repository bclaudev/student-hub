import React, { useState } from "react";
import "../AddEventModal.css"; // Specialized styles remain here
import { X, Check, Edit3, Edit, Calendar, Clock, Circle, Bell } from "react-feather";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";    // Main style file
import "react-date-range/dist/theme/default.css"; // Theme file
import format from "date-fns/format";

const AddEventModal = ({ onClose, onSave }) => {
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    dateRange: {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
    startTime: "09:00",
    endTime: "10:00",
    eventType: "appointment", // Default event type
    color: "#FF5733",         // Default color
    notifyMe: false,
  });

  const [showPicker, setShowPicker] = useState(false); // Controls calendar visibility
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const predefinedColors = ["#E3EEF8", "#D1D0E4", "#F8E3EE", "#DEEEE4", "#F8F5E3"];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle event type dropdown (if you keep that)
  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleRangeChange = (ranges) => {
    setDateRange(ranges.selection);
    setEventDetails((prev) => ({ ...prev, dateRange: ranges.selection }));
    setShowPicker(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEventTypeChange = (type) => {
    setEventDetails((prev) => ({ ...prev, eventType: type }));
  };

  const handleColorChange = (color) => {
    setEventDetails((prev) => ({ ...prev, color }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      ...eventDetails,
      start: new Date(eventDetails.dateRange.startDate),
      end: new Date(eventDetails.dateRange.endDate),
    };
    onSave(newEvent);
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const hh = hour.toString().padStart(2, "0");
        const mm = minute.toString().padStart(2, "0");
        times.push(`${hh}:${mm}`);
      }
    }
    return times.map((time) => (
      <option key={time} value={time}>
        {time}
      </option>
    ));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Title Bar */}
        <div className="add-event-title-bar">
          <h2 className="title text-lg font-semibold"></h2>
          <button
            className="close-button p-2 text-gray-700 hover:text-red-500"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} color="#D4D4D4" />
          </button>
        </div>

        {/* Two Columns Layout */}
        <div className="add-event-content-container">
          {/* Left Column */}
          <div className="add-event-left-column">
            <Edit size={20} color="#D4D4D4" className="icon" />
            <Edit3 size={20} color="#D4D4D4" className="icon" />
            <Calendar size={20} color="#D4D4D4" className="icon" />
            <Clock size={20} color="#D4D4D4" className="icon" />
            <Circle size={20} color="#D4D4D4" className="icon" />
            <Bell size={20} color="#D4D4D4" className="icon" />
          </div>

          {/* Right Column (Form Section) */}
          <div className="add-event-right-column">
            <form onSubmit={handleSubmit}>
              {/* Event Title */}
              <div className="mb-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Event name*"
                  value={eventDetails.title}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md 
                             shadow-sm focus:ring-customPurple focus:ring-1 
                             focus:border-customPurple focus:outline-none 
                             placeholder:text-placeholderGray placeholder:text-[12px]"
                />
              </div>

              {/* Event Description */}
              <div className="mb-4">
                <textarea
                  name="description"
                  placeholder="Event description"
                  value={eventDetails.description}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md 
                             shadow-sm focus:ring-customPurple focus:ring-1 
                             focus:border-customPurple focus:outline-none 
                             placeholder:text-placeholderGray placeholder:text-[12px]"
                />
              </div>

              {/* Date Range (Start/End) */}
              <div>
                <div>
                  <input
                    type="text"
                    value={
                      dateRange.startDate && dateRange.endDate
                        ? `${format(dateRange.startDate, "dd.MM.yyyy")} - 
                           ${format(dateRange.endDate, "dd.MM.yyyy")}`
                        : ""
                    }
                    readOnly
                    onClick={() => setShowPicker(true)}
                    className="date-picker-inputs"
                  />
                </div>

                {/* Calendar Picker */}
                {showPicker && (
                  <div
                    className="popup-container"
                    onClick={() => setShowPicker(false)}
                  >
                    <div
                      className="popup"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DateRange
                        ranges={[dateRange]}
                        onChange={handleRangeChange}
                        editableDateInputs
                        moveRangeOnFirstSelection={false}
                        months={1}
                        direction="horizontal"
                      />
                    </div>
                  </div>
                )}

                {/* Time Dropdowns */}
                <div className="time-dropdowns">
                  <label className="block mb-2">
                    Start Time:
                    <select
                      name="startTime"
                      value={eventDetails.startTime}
                      onChange={handleInputChange}
                      className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                    >
                      {generateTimeOptions()}
                    </select>
                  </label>
                  <label className="block mb-2">
                    End Time:
                    <select
                      name="endTime"
                      value={eventDetails.endTime}
                      onChange={handleInputChange}
                      className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                    >
                      {generateTimeOptions()}
                    </select>
                  </label>
                </div>
              </div>

              {/* Event Type Buttons */}
              <div className="event-type-container flex mb-4">
                <div
                  className={`event-type-button ${
                    eventDetails.eventType === "event" ? "active" : ""
                  }`}
                  onClick={() => handleEventTypeChange("event")}
                >
                  Event
                </div>
                <div
                  className={`event-type-button ${
                    eventDetails.eventType === "appointment" ? "active" : ""
                  }`}
                  onClick={() => handleEventTypeChange("appointment")}
                >
                  Appointment
                </div>
                <div
                  className={`event-type-button ${
                    eventDetails.eventType === "deadline" ? "active" : ""
                  }`}
                  onClick={() => handleEventTypeChange("deadline")}
                >
                  Deadline
                </div>
                <div
                  className={`event-type-button ${
                    eventDetails.eventType === "other" ? "active" : ""
                  }`}
                  onClick={() => handleEventTypeChange("other")}
                >
                  Other
                </div>
              </div>

              {/* Color Selector */}
              <div className="color-selector-container flex mb-4">
                {predefinedColors.map((color) => (
                  <div
                    key={color}
                    className={`color-circle ${
                      eventDetails.color === color ? "active" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>

              {/* Notify Me Checkbox */}
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="notifyMe"
                    checked={eventDetails.notifyMe}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-customPurple focus:ring-customPurple"
                  />
                  <span className="ml-2 text-sm text-gray-700">Notify Me</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="saveBtn"
                >
                  <Check size={24} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
