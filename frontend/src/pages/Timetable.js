import React, { useState, useEffect } from 'react';
import TimetableGrid from '../TimetableGrid.js';
import '../Timetable.css';
import AddClassModal from "../components/AddClassModal.js";

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

function getEventDuration(cls) {
  const [startHour, startMin] = cls.startTime.split(':').map(Number);
  const [endHour, endMin] = cls.endTime.split(':').map(Number);
  const durationInMinutes = endHour * 60 + endMin - (startHour * 60 + startMin);
  return durationInMinutes / 60;
}

function computeDayFromDateTime(dateStr, timeStr) {
  // If either is missing, just return null or some default
  if (!dateStr || !timeStr) return null;

  // 1) Convert date string (e.g. "2025-03-25") to a Date
  const dateObj = new Date(dateStr);

  // 2) Split "09:00" into hours/minutes and set them
  const [hours, minutes] = timeStr.split(':').map(Number);
  dateObj.setHours(hours);
  dateObj.setMinutes(minutes);

  // 3) getDay() returns an integer 0=Sun..6=Sat
  const dayIndex = dateObj.getDay();
  const dayLabels = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

  // 4) Return whichever label you need
  return dayLabels[dayIndex];
}

const Timetable = () => {
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("http://localhost:4000/api/classes", {
          method: "GET",
          credentials: "include"
        });
        if (!res.ok) {
          throw new Error("Failed to fetch classes: " + res.status);
        }
        const data = await res.json();
        if (data.success) {
          // Compute the day for each class using your helper function
          const transformed = data.classes.map(cls => ({
            ...cls,
            day: computeDayFromDateTime(cls.startDate, cls.startTime)
          }));
          setClasses(transformed);
        } else {
          console.error("Failed to fetch classes:", data.error);
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    }
    fetchClasses();
  }, []);
  // Show AddClassModal
  const handleAddClassClick = () => {
    setIsModalOpen(true);
  };

  // Hide AddClassModal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // When new class is saved in the modal, add it to local state
  const handleSaveClass = (newClass) => {
    setClasses(prevClasses => [...prevClasses, newClass]);
    handleCloseModal();
  };

  // Baseline hours for the timetable
  const baselineStartHour = 10;
  const baselineEndHour = 19;

  // Compute the earliest/ latest hours from existing classes
  const classStartHours = classes.map(cls => parseInt(cls.startTime.split(':')[0], 10));
  const computedStartHour =
    classes.length > 0 ? Math.min(baselineStartHour, ...classStartHours) : baselineStartHour;
  const computedEndHour =
    classes.length > 0 ? Math.max(baselineEndHour, ...classStartHours) : baselineEndHour;

  // Build array of hour values
  const hours = Array.from({ length: computedEndHour - computedStartHour + 1 },
    (_, i) => computedStartHour + i
  );

  // Returns the class that starts exactly at [day, hour], if any
  const getClassForTimeSlot = (day, hour) => {
    return classes.find(cls => {
      const startHour = parseInt(cls.startTime.split(':')[0], 10);
      return cls.day === day && startHour === hour;
    });
  };

  // Renders a single class event
  const renderClassEvent = (classEvent, cellHeight) => {
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
  };

  const cellHeight = 80; // controls the base row size

  return (
    <div className="timetable-container">
      <div className="timetable-header h-[69px]">
        <div className="timetable-title-container">
          <h1 className="timetable-title">Timetable</h1>
        </div>
        <div className="flex justify-end pr-[32px]">
          <button onClick={handleAddClassClick} className="timetable-button">
            Add Class
          </button>
        </div>
      </div>

      <div className="timetable-content">
        <TimetableGrid
          days={days}
          hours={hours}
          getClassForTimeSlot={getClassForTimeSlot}
          renderClassEvent={renderClassEvent}
          getEventDuration={getEventDuration}
          cellHeight={cellHeight}
        />
      </div>

      {isModalOpen && (
        <AddClassModal
          onClose={handleCloseModal}
          onSave={handleSaveClass}
        />
      )}
    </div>
  );
};

export default Timetable;
