import React, { useState } from "react";
import "../AddEventModal.css";
import { X, Check, Edit3, Edit, Calendar, Clock, Circle, Bell } from 'react-feather';


const AddEventModal = ({ onClose, onSave }) => {
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    eventType: "appointment", // Default event type
    color: "#FF5733", // Default color
    notifyMe: false,
  });

  const predefinedColors = ["#E3EEF8", "#D1D0E4", "#F8E3EE", "#DEEEE4", "#F8F5E3"]; // Example colors

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      ...eventDetails,
      start: new Date(eventDetails.start),
      end: new Date(eventDetails.end),
    };
    onSave(newEvent);
  };

  const handleEventTypeChange = (type) => {
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      eventType: type,
    }));
  };

  const handleColorChange = (color) => {
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      color: color,
    }));
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="modal-container bg-white rounded-lg w-[800px] shadow-lg relative">
    {/* Title Bar */}
    <div
      className="title-bar flex items-center justify-between"
      style={{
        position: "relative",
        top: "0",
        height: "50px",
        borderBottom: "1px solid #E5E5E5",
      }}
    >
      <h2 className="title text-lg font-semibold"></h2>
      <button
        className="close-button p-2 text-gray-700 hover:text-red-500"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={24} color="#D4D4D4"/>
      </button>
    </div>

    {/* Two Columns Layout */}
    <div className="content-container flex">
      {/* Left Column */}
      <div className="left-column flex flex-col items-center p-4 gap-6 border-r border-gray-300">
        <Edit size={20} color="#D4D4D4" className="icon" />
        <Edit3 size={20} color="#D4D4D4" className="icon" />
        <Calendar size={20} color="#D4D4D4" className="icon" />
        <Clock size={20} color="#D4D4D4" className="icon" />
        <Circle size={20} color="#D4D4D4" className="icon" />
        <Bell size={20} color="#D4D4D4" className="icon" />
      </div>

      {/* Right Column (Form Section) */}
      <div className="right-column flex-1 p-4">
        <form onSubmit={handleSubmit}>
          {/* Event Title */}
          <div className="mb-4">
            <input
              type="text"
              name="title"
              placeholder="Event name*"
              value={eventDetails.title}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-customPurple focus:ring-1 focus:border-customPurple focus:outline-none placeholder:text-placeholderGray placeholder:text-[12px]"
              required
            />
          </div>

          {/* Event Description */}
          <div className="mb-4">
            <textarea
              name="description"
              placeholder="Event description"
              value={eventDetails.description}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-customPurple focus:ring-1 focus:border-customPurple focus:outline-none placeholder:text-placeholderGray placeholder:text-[12px]"
            />
          </div>

          {/* Start and End Date */}
          <div className="mb-4 flex items-center gap-4">
            <input
              type="datetime-local"
              name="start"
              placeholder="Start Date"
              value={eventDetails.start}
              onChange={handleInputChange}
              className="date-input flex-1"
              autoComplete="off"
              required
            />
            <input
              type="datetime-local"
              name="end"
              placeholder="End Date"
              value={eventDetails.end}
              onChange={handleInputChange}
              className="date-input flex-1"
              autoComplete="off"
              required
            />
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
              ></div>
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
              className="saveBtn w-12 h-12 bg-customPurple text-white rounded-full flex items-center justify-center hover:bg-[#8060DB]"
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
