import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import TimetableGrid from '../TimetableGrid.js';
import '../Timetable.css';

const initialClasses = [ /* ... your initial classes ... */ ];
const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

const TimetablePage = () => {
  const [classes, setClasses] = useState(initialClasses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({});

  const baselineStartHour = 10;
  const baselineEndHour = 19;
  const classStartHours = classes.map(cls => parseInt(cls.startTime.split(':')[0], 10));
  const computedStartHour =
    classes.length > 0 ? Math.min(baselineStartHour, ...classStartHours) : baselineStartHour;
  const computedEndHour =
    classes.length > 0 ? Math.max(baselineEndHour, ...classStartHours) : baselineEndHour;

  const hours = Array.from(
    { length: computedEndHour - computedStartHour + 1 },
    (_, i) => computedStartHour + i
  );

  const getClassForTimeSlot = (day, hour) => {
    return classes.find(cls => {
      const startHour = parseInt(cls.startTime.split(':')[0], 10);
      return cls.day === day && hour === startHour;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const colors = [ /* ... colors array ... */ ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newClassEvent = {
      id: Date.now().toString(),
      subject: newClass.subject || '',
      room: newClass.room || '',
      startTime: newClass.startTime || '',
      endTime: newClass.endTime || '',
      day: newClass.day || '',
      professor: newClass.professor || '',
      color: randomColor,
    };
    setClasses([...classes, newClassEvent]);
    setIsModalOpen(false);
    setNewClass({});
  };

  // cellHeight for grid rows
  const cellHeight = 80;

  // Render your page with header, the TimetableGrid component, and the modal
  return (
    <div className="timetable-container">
      <div className="timetable-header h-[69px]">
        <div className="timetable-title-container">
          <h1 className="timetable-title">Timetable</h1>
        </div>
        <div className="flex justify-end pr-[32px]">
          <button onClick={() => setIsModalOpen(true)} className="timetable-button">
            Add Class
          </button>
        </div>
      </div>
      
      <div className="timetable-content">
        <TimetableGrid
          days={days}
          hours={hours}
          getClassForTimeSlot={getClassForTimeSlot}
          cellHeight={cellHeight}
        />
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          {/* Modal content here */}
        </div>
      )}
    </div>
  );
};

export default TimetablePage;
