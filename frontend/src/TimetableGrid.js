import React from 'react';
import './Timetable.css';

const TimetableGrid = ({
  days,
  hours,
  getClassForTimeSlot,
  getEventDuration,
  cellHeight,
}) => {
  return (
    <div className="timetable-grid">
      {/* Header Section: week counter + day headers */}
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
        const period = hour < 12 ? 'AM' : 'PM';

        return (
          <div key={hour} className="timetable-row">
            {/* Left cell shows the hour + AM/PM */}
            <div className="timetable-time-cell">
              {`${displayHour} ${period}`}
            </div>
            
            {/* Cells for each day in the row */}
            {days.map(day => {
              const classEvent = getClassForTimeSlot(day, hour);
              return (
                <div key={`${day}-${hour}`} className="timetable-cell">
                  {/* If there's a matching event at this [day, hour]... */}
                  {classEvent &&
                    hour === parseInt(classEvent.startTime.split(':')[0], 10) &&

                    // Inline logic for computing event offset + height
                    (() => {
                      const durationHours = getEventDuration(classEvent);
                      const eventHeight = durationHours * cellHeight;
                      const startMin = parseInt(classEvent.startTime.split(':')[1], 10);
                      const offset = (startMin / 60) * cellHeight;
                      
                      return (
                        <div
                          className={`timetable-event ${classEvent.color}`}
                          style={{ top: `${offset}px`, height: `${eventHeight}px` }}
                        >
                          <div className="timetable-event-subject">{classEvent.subject}</div>
                          <div className="timetable-event-room">{classEvent.room}</div>
                          <div className="timetable-event-time">
                            {`${classEvent.startTime} - ${classEvent.endTime}`}
                          </div>
                        </div>
                      );
                    })()
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
