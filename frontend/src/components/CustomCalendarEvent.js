import "../CustomCalendarEvent.css";
import React from "react";

const CustomCalendarEvent = ({ event }) => {

  const formattedTime = new Date(event.start).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div style= {{ backgroundColor: event.color, padding: "2px 16px", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center"}}>
      <div title={event.title}>
      <span style={{ marginRight: "8px" }}>{formattedTime}</span>
        <strong>{event.title}</strong>
      </div>
    </div>
  );
};

export default CustomCalendarEvent;
