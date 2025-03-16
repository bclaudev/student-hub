import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import TimetableGrid from '../TimetableGrid.js';
import '../Timetable.css';

const initialClasses = [
  {
    id: '1',
    subject: 'Mathematics',
    room: 'Room 101',
    startTime: '09:00',
    endTime: '10:30',
    day: 'MON',
    professor: 'Dr. Smith',
    color: 'bg-blue-100 border-blue-300',
  },
  {
    id: '2',
    subject: 'Physics',
    room: 'Lab 203',
    startTime: '13:00',
    endTime: '14:30',
    day: 'WED',
    professor: 'Dr. Johnson',
    color: 'bg-green-100 border-green-300',
  },
  {
    id: '3',
    subject: 'Computer Science',
    room: 'Room 405',
    startTime: '15:00',
    endTime: '16:30',
    day: 'FRI',
    professor: 'Prof. Davis',
    color: 'bg-purple-100 border-purple-300',
  },
];

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

const getEventDuration = (cls) => {
    const [startHour, startMin] = cls.startTime.split(':').map(Number);
    const [endHour, endMin] = cls.endTime.split(':').map(Number);
    const durationInMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    return durationInMinutes / 60;
  };

const Timetable = () => {
  const [classes, setClasses] = useState(initialClasses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({});


  const baselineStartHour = 10;
  const baselineEndHour = 19;

  // Gather the start hours from existing classes
  const classStartHours = classes.map(cls => parseInt(cls.startTime.split(':')[0], 10));

  // Compute the earliest and latest hours displayed
  const computedStartHour =
    classes.length > 0 ? Math.min(baselineStartHour, ...classStartHours) : baselineStartHour;
  const computedEndHour =
    classes.length > 0 ? Math.max(baselineEndHour, ...classStartHours) : baselineEndHour;

  // Build array of hour values
  const hours = Array.from(
    { length: computedEndHour - computedStartHour + 1 },
    (_, i) => computedStartHour + i
  );

  // Returns the class that starts exactly at [day, hour], if any
  const getClassForTimeSlot = (day, hour) => {
    return classes.find(cls => {
      const startHour = parseInt(cls.startTime.split(':')[0], 10);
      return cls.day === day && hour === startHour;
    });
  };

  // Helper function to compute event duration in hours
  const getEventDuration = (cls) => {
    const [startHour, startMin] = cls.startTime.split(':').map(Number);
    const [endHour, endMin] = cls.endTime.split(':').map(Number);
    const durationInMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    return durationInMinutes / 60;
  };

  // Renders a single class event as an absolutely positioned box
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const colorOptions = [
      'bg-blue-100 border-blue-300',
      'bg-green-100 border-green-300',
      'bg-purple-100 border-purple-300',
      'bg-pink-100 border-pink-300',
      'bg-yellow-100 border-yellow-300',
    ];
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
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

  const cellHeight = 80; // controls the base row size

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
        {/* Here we pass renderClassEvent to TimetableGrid */}
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
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add New Class</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="modal-close-button"
              >
                <X className="timetable-x" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div>
                <label className="modal-label">Subject</label>
                <input
                  type="text"
                  value={newClass.subject || ''}
                  onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                  className="modal-input"
                  required
                />
              </div>
              <div>
                <label className="modal-label">Room</label>
                <input
                  type="text"
                  value={newClass.room || ''}
                  onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                  className="modal-input"
                  required
                />
              </div>
              <div>
                <label className="modal-label">Professor</label>
                <input
                  type="text"
                  value={newClass.professor || ''}
                  onChange={(e) => setNewClass({ ...newClass, professor: e.target.value })}
                  className="modal-input"
                  required
                />
              </div>
              <div>
                <label className="modal-label">Day</label>
                <select
                  value={newClass.day || ''}
                  onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
                  className="modal-input"
                  required
                >
                  <option value="">Select a day</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="modal-label">Start Time</label>
                <input
                  type="time"
                  value={newClass.startTime || ''}
                  onChange={(e) => setNewClass({ ...newClass, startTime: e.target.value })}
                  className="modal-input"
                  required
                />
              </div>
              <div>
                <label className="modal-label">End Time</label>
                <input
                  type="time"
                  value={newClass.endTime || ''}
                  onChange={(e) => setNewClass({ ...newClass, endTime: e.target.value })}
                  className="modal-input"
                  required
                />
              </div>
              <button type="submit" className="modal-button">
                Add Class
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
