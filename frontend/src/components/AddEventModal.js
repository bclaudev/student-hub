import React, { useState } from "react";
import "../AddEventModal.css"; // Specialized styling remains here
import { X, Check, Edit, Edit3, Calendar, Clock, Circle, Bell } from "react-feather";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
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
    eventType: "appointment",
    color: "#FF5733",
    notifyMe: false,
  });

  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [showPicker, setShowPicker] = useState(false);

  const predefinedColors = ["#E3EEF8", "#D1D0E4", "#F8E3EE", "#DEEEE4", "#F8F5E3"];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle date range changes
  const handleRangeChange = (ranges) => {
    setDateRange(ranges.selection);
    setEventDetails((prev) => ({
      ...prev,
      dateRange: ranges.selection,
    }));
    setShowPicker(false);
  };

  // Handle event type change
  const handleEventTypeChange = (type) => {
    setEventDetails((prev) => ({ ...prev, eventType: type }));
  };

  // Handle color change
  const handleColorChange = (color) => {
    setEventDetails((prev) => ({ ...prev, color }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      ...eventDetails,
      start: new Date(eventDetails.dateRange.startDate),
      end: new Date(eventDetails.dateRange.endDate),
    };
    onSave(newEvent);
  };

  // Generate quarter-hour time options
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const hh = String(hour).padStart(2, "0");
        const mm = String(minute).padStart(2, "0");
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
            className="close-button"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="feather-icon" size={24} />
          </button>
        </div>

        {/* Two-column grid so each icon lines up with the matching field */}
        <form onSubmit={handleSubmit} className="event-modal-form">

          {/* 1) Title */}
          <div className="centered-icon">
            <Edit className="feather-icon" size={20} />
          </div>
          <div className="event-modal-form-field">
            <input
              type="text"
              name="title"
              placeholder="Event name*"
              value={eventDetails.title}
              onChange={handleInputChange}
              required
              className="event-modal-input"
            />
          </div>

          {/* 2) Description */}
          <div className="centered-icon">
            <Edit3 className="feather-icon" size={20} />
          </div>
          <div className="event-modal-form-field">
            <textarea
              name="description"
              placeholder="Event description"
              value={eventDetails.description}
              onChange={handleInputChange}
              className="event-modal-textarea"
            />
          </div>

          {/* 3) Date Range */}
          <div className="centered-icon">
            <Calendar className="feather-icon" size={20} />
          </div>
          <div>
            <input
              type="text"
              value={
                dateRange.startDate && dateRange.endDate
                  ? `${format(dateRange.startDate, "dd.MM.yyyy")} - ${format(dateRange.endDate, "dd.MM.yyyy")}`
                  : ""
              }
              readOnly
              onClick={() => setShowPicker(true)}
              className="date-picker-inputs"
            />
            {showPicker && (
              <div className="popup-container" onClick={() => setShowPicker(false)}>
                <div className="popup" onClick={(e) => e.stopPropagation()}>
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
          </div>

          {/* 4) Time (Start/End) */}
          <div className="centered-icon">
            <Clock className="feather-icon" size={20} />
          </div>
          <div className="event-modal-form-field grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-sm">Start Time:</span>
              <select
                name="startTime"
                value={eventDetails.startTime}
                onChange={handleInputChange}
                className="event-modal-select"
              >
                {generateTimeOptions()}
              </select>
            </label>
            <label className="block">
              <span className="text-sm">End Time:</span>
              <select
                name="endTime"
                value={eventDetails.endTime}
                onChange={handleInputChange}
                className="event-modal-select"
              >
                {generateTimeOptions()}
              </select>
            </label>
          </div>

          {/* 5) Event Type + Color */}
          <div className="centered-icon">
            <Circle className="feather-icon" size={20} />
          </div>
          <div className="event-modal-form-field">
            {/* Event Type Buttons */}
            <div className="event-type-container flex mb-4">
              <div
                className={`event-type-button ${eventDetails.eventType === "event" ? "active" : ""}`}
                onClick={() => handleEventTypeChange("event")}
              >
                Event
              </div>
              <div
                className={`event-type-button ${eventDetails.eventType === "appointment" ? "active" : ""}`}
                onClick={() => handleEventTypeChange("appointment")}
              >
                Appointment
              </div>
              <div
                className={`event-type-button ${eventDetails.eventType === "deadline" ? "active" : ""}`}
                onClick={() => handleEventTypeChange("deadline")}
              >
                Deadline
              </div>
              <div
                className={`event-type-button ${eventDetails.eventType === "other" ? "active" : ""}`}
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
                  className={`color-circle ${eventDetails.color === color ? "active" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>

          {/* 6) Notify Me */}
          <div className="centered-icon">
            <Bell className="feather-icon" size={20} />
          </div>
          <div className="mb-4 flex items-center">
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

          {/* 7) Save button */}
          <div></div>
          <div className="flex justify-end">
            <button type="submit" className="saveBtn">
              <Check size={24} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
