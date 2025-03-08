import React, { useState, useEffect } from "react";
import "../AddEventModal.css";
import { EVENT_TYPE_COLORS } from "../config/eventColors.js";
import { 
  X, Check, Edit, Edit3, Calendar, Clock, Circle, Bell, 
  MapPin, AlertTriangle, Link as LinkIcon, User, Repeat, Book, FileText, Clipboard, BookOpen
} from "react-feather";
import { FaPaintBrush } from "react-icons/fa";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import format from "date-fns/format";

const AddEventModal = ({ onClose, onSave, event }) => {
  const [eventDetails, setEventDetails] = useState({
    title: event ? event.title : "",
    description: event ? event.description : "",
    dateRange: {
      startDate: event ? new Date(event.startDateTime) : new Date(),
      endDate: event ? new Date(event.endDateTime) : new Date(),
      key: "selection",
    },
    startTime: event ? format(new Date(event.startDateTime), "HH:mm") : "09:00",
    endTime: event ? format(new Date(event.endDateTime), "HH:mm") : "10:00",
    eventType: event ? event.eventType : "appointment",
    color: event ? event.color : "#FF5733",
    notifyMe: event ? event.notifyMe : false,

    // Extra fields
    location: event && event.location ? event.location : "",
    priority: event && event.priority ? event.priority : "",
    locationMode: event && event.locationMode ? event.locationMode : "",
    meetingLink: event && event.meetingLink ? event.meetingLink : "",
    locationRoom: event && event.locationRoom ? event.locationRoom : "",
    instructorName: event && event.instructorName ? event.instructorName : "",
    recurringPattern: event && event.recurringPattern ? event.recurringPattern : "",
    courseCode: event && event.courseCode ? event.courseCode : "",
    linkSubjectId: event && event.linkSubjectId ? event.linkSubjectId : "",
    allowedMaterials: event && event.allowedMaterials ? event.allowedMaterials : "",
    topicsChapters: event && event.topicsChapters ? event.topicsChapters : "",
    linkedClass: event && event.linkedClass ? event.linkedClass : ""
  });


  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const palette = EVENT_TYPE_COLORS[eventDetails.eventType] || EVENT_TYPE_COLORS.event;


  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (event) {
      setEventDetails({
        title: event.title,
        description: event.description,
        dateRange: {
          startDate: new Date(event.startDateTime),
          endDate: new Date(event.endDateTime),
          key: "selection",
        },
        startTime: format(new Date(event.startDateTime), "HH:mm"),
        endTime: format(new Date(event.endDateTime), "HH:mm"),
        eventType: event.eventType,
        color: event.color,
        notifyMe: event.notifyMe,

        location: event.location,
        priority: event.priority,
        locationMode: event.locationMode,
        meetingLink: event.meetingLink,
        locationRoom: event.locationRoom,
        instructorName: event.instructorName,
        recurringPattern: event.recurringPattern,
        courseCode: event.courseCode,
        linkSubjectId: event.linkSubjectId,
        allowedMaterials: event.allowedMaterials,
        topicsChapters: event.topicsChapters,
        linkedClass: event.linkedClass
      });
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  
  const handleRangeChange = (ranges) => {
    setDateRange(ranges.selection);
    setEventDetails((prev) => ({
      ...prev,
      dateRange: ranges.selection,
    }));
    setShowPicker(false);
  };

  const handleEventTypeChange = (type) => {
    setEventDetails((prev) => ({ ...prev, eventType: type }));
  };

  const handleColorChange = (color) => {
    setEventDetails((prev) => ({ ...prev, color }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startDateTime = new Date(eventDetails.dateRange.startDate);
    const endDateTime = new Date(eventDetails.dateRange.endDate);

    const [startH, startM] = eventDetails.startTime.split(":").map(Number);
    startDateTime.setHours(startH, startM);

    const [endH, endM] = eventDetails.endTime.split(":").map(Number);
    endDateTime.setHours(endH, endM);

    const newEventData = {
      title: eventDetails.title,
      description: eventDetails.description,
      startDateTime,
      endDateTime,
      eventType: eventDetails.eventType,
      color: eventDetails.color,
      notifyMe: eventDetails.notifyMe,
      location: eventDetails.location,
      priority: eventDetails.priority,
      locationMode: eventDetails.locationMode,
      meetingLink: eventDetails.meetingLink,
      locationRoom: eventDetails.locationRoom,
      instructorName: eventDetails.instructorName,
      recurringPattern: eventDetails.recurringPattern,
      courseCode: eventDetails.courseCode,
      linkSubjectId: eventDetails.linkSubjectId,
      allowedMaterials: eventDetails.allowedMaterials,
      topicsChapters: eventDetails.topicsChapters,
      linkedClass: eventDetails.linkedClass
    };

    try {
      let response;
      if (event && event.id) {
        response = await fetch(`http://localhost:4000/api/events/${event.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(newEventData)
        });
      } else {
        response = await fetch("http://localhost:4000/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(newEventData)
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save event on the server.");
      }

      const data = await response.json();
      const savedEvent = Array.isArray(data.event) ? data.event[0] : data.event;
      console.log("Extracted savedEvent:", savedEvent);
      onSave(savedEvent);
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event. See console for details.");
    }
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

        {/* Form */}
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
              onClick={() => setShowPicker(!showPicker)}
              className="date-picker-inputs"
            />
            {showPicker && (
              <div className="inline-date-range">
                <DateRange
                  ranges={[dateRange]}
                  onChange={handleRangeChange}
                  editableDateInputs
                  moveRangeOnFirstSelection={false}
                  months={1}
                  direction="horizontal"
                />
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

          {/* 5) Event Type */}
          <div className="centered-icon">
            <Circle className="feather-icon" size={20} />
          </div>
          <div className="event-modal-form-field">
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
                className={`event-type-button ${eventDetails.eventType === "class" ? "active" : ""}`}
                onClick={() => handleEventTypeChange("class")}
              >
                Class
              </div>
              <div
                className={`event-type-button ${eventDetails.eventType === "exam" ? "active" : ""}`}
                onClick={() => handleEventTypeChange("exam")}
              >
                Exam
              </div>
              <div
                className={`event-type-button ${eventDetails.eventType === "study session" ? "active" : ""}`}
                onClick={() => handleEventTypeChange("study session")}
              >
                Study Session
              </div>
            </div>
          </div>

          {/* 5.1) Color */}
          <div className="centered-icon">
            <FaPaintBrush size={20} className="feather-icon" />
          </div>
          <div className="event-modal-form-field">
            <div className="color-selector-container flex mb-4">
              {palette.map((color) => (
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

          {/* Appointment */}
          {eventDetails.eventType === "appointment" && (
            <>
              <div className="centered-icon">
                <MapPin className="feather-icon" size={20} />
              </div>
              <div className="event-modal-form-field">
                <input
                  type="text"
                  name="location"
                  value={eventDetails.location}
                  onChange={handleInputChange}
                  className="event-modal-input"
                  placeholder="e.g. Doctor's office"
                />
              </div>
            </>
          )}

          {/* Deadline */}
          {eventDetails.eventType === "deadline" && (
            <>
              <div className="centered-icon">
                <AlertTriangle className="feather-icon" size={20} />
              </div>
              <div className="event-modal-form-field">
                <select
                  name="priority"
                  value={eventDetails.priority}
                  onChange={handleInputChange}
                  className="event-modal-select"
                >
                  <option value="">Select priority</option>
                  <option value="Critical">Critical</option>
                  <option value="Major">Major</option>
                  <option value="Minor">Minor</option>
                  <option value="Trivial">Trivial</option>
                </select>
              </div>
            </>
          )}

          {/* Class */}
          {eventDetails.eventType === "class" && (
            <>
              {/* Location Mode */}
              <div className="centered-icon">
                <MapPin className="feather-icon" size={20} />
              </div>
              <div className="event-modal-form-field">
                <select
                  name="locationMode"
                  value={eventDetails.locationMode}
                  onChange={handleInputChange}
                  className="event-modal-select"
                >
                  <option value="">Select location mode</option>
                  <option value="online">Online</option>
                  <option value="classroom">Classroom</option>
                </select>
              </div>

              {/* Meeting Link (only if online) */}
              {eventDetails.locationMode === "online" && (
                <>
                  <div className="centered-icon">
                    <LinkIcon className="feather-icon" size={20} />
                  </div>
                  <div className="event-modal-form-field">
                    <input
                      type="text"
                      name="meetingLink"
                      value={eventDetails.meetingLink}
                      onChange={handleInputChange}
                      className="event-modal-input"
                      placeholder="e.g. Zoom link"
                    />
                  </div>
                </>
              )}

              {/* Classroom (only if classroom) */}
              {eventDetails.locationMode === "classroom" && (
                <>
                  <div className="centered-icon">
                    <MapPin className="feather-icon" size={20} />
                  </div>
                  <div className="event-modal-form-field">
                    <input
                      type="text"
                      name="locationRoom"
                      value={eventDetails.locationRoom}
                      onChange={handleInputChange}
                      className="event-modal-input"
                      placeholder="e.g. Room 210"
                    />
                  </div>
                </>
              )}

              {/* Instructor Name */}
              <div className="centered-icon">
                <User className="feather-icon" size={20} />
              </div>
              <div className="event-modal-form-field">
                <input
                  type="text"
                  name="instructorName"
                  value={eventDetails.instructorName}
                  onChange={handleInputChange}
                  className="event-modal-input"
                  placeholder="e.g. Dr. Smith"
                />
              </div>

              {/* Recurring Pattern */}
              <div className="centered-icon">
                <Repeat className="feather-icon" size={20} />
              </div>
              <div className="event-modal-form-field">
                <select
                  name="recurringPattern"
                  value={eventDetails.recurringPattern}
                  onChange={handleInputChange}
                  className="event-modal-select"
                >
                  <option value="">No recurrence</option>
                  <option value="once a week">Once a week</option>
                  <option value="once every 2 weeks">Once every 2 weeks</option>
                  <option value="once every 3 weeks">Once every 3 weeks</option>
                  <option value="once a month">Once a month</option>
                  <option value="daily">Daily</option>
                </select>
              </div>

              {/* Course Code */}
              <div className="centered-icon">
                <Book className="feather-icon" size={20} />
              </div>
              <div className="event-modal-form-field">
                <input
                  type="text"
                  name="courseCode"
                  value={eventDetails.courseCode}
                  onChange={handleInputChange}
                  className="event-modal-input"
                  placeholder="e.g. MATH101"
                />
              </div>

              {/* Link Subject ID */}
              <div className="centered-icon">
                <FileText className="feather-icon" size={20} />
              </div>
              <div className="event-modal-form-field">
                <input
                  type="number"
                  name="linkSubjectId"
                  value={eventDetails.linkSubjectId}
                  onChange={handleInputChange}
                  className="event-modal-input"
                  placeholder="e.g. 42"
                />
              </div>
            </>
          )}

          {/* Exam */}
          {eventDetails.eventType === "exam" && (
            <>
              {/* Location */}
              <div className="centered-icon">
                <MapPin className="feather-icon" size={20} />
              </div>
              <div className="event-modal-form-field">
                <input
                  type="text"
                  name="location"
                  value={eventDetails.location}
                  onChange={handleInputChange}
                  className="event-modal-input"
                  placeholder="e.g. Main Hall"
                />
              </div>

              {/* Allowed Materials */}
              <div className="centered-icon">
                <Clipboard className="feather-icon" size={20} />
              </div>
              <div className="event-modal-form-field">
                <input
                  type="text"
                  name="allowedMaterials"
                  value={eventDetails.allowedMaterials}
                  onChange={handleInputChange}
                  className="event-modal-input"
                  placeholder="e.g. Calculator, formula sheet"
                />
              </div>
            </>
          )}

          {/* Study Session */}
          {eventDetails.eventType === "study session" && (
            <>
              {/* Location */}
              <div className="centered-icon">
                <MapPin className="feather-icon" size={20} />
              </div>
              <div className="event-modal-form-field">
                <input
                  type="text"
                  name="location"
                  value={eventDetails.location}
                  onChange={handleInputChange}
                  className="event-modal-input"
                  placeholder="e.g. Library 2nd Floor"
                />
              </div>

              {/* Topics / Chapters */}
              <div className="centered-icon">
                <BookOpen className="feather-icon" size={20} />
              </div>
              <div className="event-modal-form-field">
                <input
                  type="text"
                  name="topicsChapters"
                  value={eventDetails.topicsChapters}
                  onChange={handleInputChange}
                  className="event-modal-input"
                  placeholder="e.g. Chapter 4, 5, 6"
                />
              </div>

              {/* Linked Class */}
              <div className="centered-icon">
                <LinkIcon className="feather-icon" size={20} />
              </div>
              <div className="event-modal-form-field">
                <input
                  type="text"
                  name="linkedClass"
                  value={eventDetails.linkedClass}
                  onChange={handleInputChange}
                  className="event-modal-input"
                  placeholder="e.g. Class ID or Name"
                />
              </div>
            </>
          )}

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
