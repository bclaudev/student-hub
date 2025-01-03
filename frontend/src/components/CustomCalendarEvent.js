import "../CustomCalendarEvent.css";
import React from "react";

const CustomCalendarEvent = ({ event }) => {
  return (
    <div>
      <strong>{event.title}</strong>
      <p>{event.description}</p>
    </div>
  );
};

export default CustomCalendarEvent;
