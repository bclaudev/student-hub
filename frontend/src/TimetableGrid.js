import React from 'react';
import './Timetable.css';

const TimetableGrid = ({ days, hours, getClassForTimeSlot, cellHeight }) => {
  return (
    <div className="timetable-grid">
      {/* Header Section */}
      <div className="timetable-grid-header">
        <div className="timetable-week-counter">1</div>
        {days.map(day => (
          <div key={day} className="timetable-day-header">
            {day}
          </div>
        ))}
      </div>
      {/* Hour Rows */}
      {hours.map(hour => {
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const period = hour < 12 ? "AM" : "PM";
        return (
          <div key={hour} className="timetable-row">
            <div className="timetable-time-cell">
              {`${displayHour}:00 ${period}`}
            </div>
            {days.map(day => {
              const classEvent = getClassForTimeSlot(day, hour);
              return (
                <div key={`${day}-${hour}`} className="timetable-cell">
                  {classEvent &&
                    hour === parseInt(classEvent.startTime.split(':')[0], 10) &&
                    renderClassEvent(classEvent, cellHeight)
                  }
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default TimetableGrid;
