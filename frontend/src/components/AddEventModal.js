import React, { useState } from "react";
import "../AddEventModal.css";
import { X } from 'react-feather';


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
    <div className="modal-container bg-white rounded-lg p-6 w-[463px] shadow-lg relative">
    {/* Title Bar */}
    <div
      className="title-bar flex items-center justify-end"
      style={{
        position: "relative",
        top: "0",
        height: "50px",
        borderBottom: "1px solid #E5E5E5",
        padding: "0 16px",
      }}
    >
      <button
        className="close-button p-2 text-gray-700 hover:text-red-500"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={24} />
      </button>
    </div>

    {/* Form Section */}
    <form onSubmit={handleSubmit}>
      <div className="mb-4 mt-5">
        <input
          type="text"
          name="title"
          placeholder="Event name*"
          value={eventDetails.title}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border w-[375px] border-gray-300 rounded-md shadow-sm focus:ring-customPurple focus:border-customPurple"
          required
        />
      </div>

      <div className="mb-4">
        <textarea
          name="description"
          placeholder="Event description"
          value={eventDetails.description}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border w-[375px] h-[128px] border-gray-300 rounded-md shadow-sm focus:ring-customPurple focus:border-customPurple"
        />
      </div>

      <div className="mb-4 flex items-center">
        <div className="date-field start-date">
          <input
            type="datetime-local"
            name="start"
            placeholder="Start Date"
            value={eventDetails.start}
            onChange={handleInputChange}
            className="date-input"
            autoComplete="off"
            required
          />
        </div>

        <div className="date-field end-date">
          <input
            type="datetime-local"
            name="end"
            placeholder="End Date"
            value={eventDetails.end}
            onChange={handleInputChange}
            className="date-input"
            autoComplete="off"
            required
          />
        </div>
      </div>

      <div className="event-type-container flex">
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

      <div className="color-selector-container flex">
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

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-customPurple text-white rounded hover:bg-[#8060DB]"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</div>
);
};


export default AddEventModal;
