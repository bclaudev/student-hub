import React, { useState } from "react";
import { X, Check } from "react-feather";

const AddClassModal = ({ onClose, onSave }) => {
  const [classData, setClassData] = useState({
    name: "",
    teacherName: "",
    startDate: "",
    startTime: "", // New
    endTime: "",   // New
    recurrence: "", 
    curriculum: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert the date (string) to a proper Date object if needed
    // For example, if you are storing just the date in `startDate`,
    // then you can keep it as a string or parse it. It depends on what your backend expects.
    const startDateValue = classData.startDate ? new Date(classData.startDate) : null;

    const payload = {
      name: classData.name,
      teacherName: classData.teacherName,
      startDate: startDateValue,
      startTime: classData.startTime,  // e.g. "09:00"
      endTime: classData.endTime,      // e.g. "10:00"
      recurrence: classData.recurrence,
      curriculum: classData.curriculum,
      // createdBy: userId,
    };

    try {
      const response = await fetch("http://localhost:4000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // Include cookies for session management
      });

      if (!response.ok) {
        throw new Error("Failed to create the class on the server.");
      }

      const data = await response.json();
      const savedClass = data.class; // Or however your backend returns the newly created class

      // Fire the onSave callback so the parent can update its state
      onSave(savedClass);

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to save class. See console for details.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* --- Title Bar --- */}
        <div className="add-class-title-bar">
          <h2 className="title text-lg font-semibold">Add New Class</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <X className="feather-icon" size={24} />
          </button>
        </div>

        {/* --- Form --- */}
        <form onSubmit={handleSubmit} className="class-modal-form">
          {/* 1) Class Name */}
          <div className="label-and-input">
            <label htmlFor="name" className="block text-sm font-medium">Class Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Algebra 101"
              value={classData.name}
              onChange={handleInputChange}
              required
              className="modal-input"
            />
          </div>

          {/* 2) Teacher Name */}
          <div className="label-and-input">
            <label htmlFor="teacherName" className="block text-sm font-medium">Teacher Name</label>
            <input
              type="text"
              id="teacherName"
              name="teacherName"
              placeholder="e.g. Dr. Smith"
              value={classData.teacherName}
              onChange={handleInputChange}
              className="modal-input"
            />
          </div>

          {/* 3) Start Date */}
          <div className="label-and-input">
            <label htmlFor="startDate" className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={classData.startDate}
              onChange={handleInputChange}
              className="modal-input"
            />
          </div>

          {/* 4) Start Time */}
          <div className="label-and-input">
            <label htmlFor="startTime" className="block text-sm font-medium">Start Time</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={classData.startTime}
              onChange={handleInputChange}
              className="modal-input"
            />
          </div>

          {/* 5) End Time */}
          <div className="label-and-input">
            <label htmlFor="endTime" className="block text-sm font-medium">End Time</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={classData.endTime}
              onChange={handleInputChange}
              className="modal-input"
            />
          </div>

          {/* 6) Recurrence */}
          <div className="label-and-input">
            <label htmlFor="recurrence" className="block text-sm font-medium">Recurrence</label>
            <select
              id="recurrence"
              name="recurrence"
              value={classData.recurrence}
              onChange={handleInputChange}
              className="modal-input"
            >
              <option value="">No recurrence</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="none">None</option>
              {/* Add more if needed */}
            </select>
          </div>

          {/* 7) Curriculum (optional) */}
          <div className="label-and-input">
            <label htmlFor="curriculum" className="block text-sm font-medium">Curriculum</label>
            <textarea
              id="curriculum"
              name="curriculum"
              rows={3}
              placeholder="Brief description or topics..."
              value={classData.curriculum}
              onChange={handleInputChange}
              className="modal-textarea"
            />
          </div>

          {/* 8) Submit Button */}
          <div className="flex justify-end mt-4">
            <button type="submit" className="saveBtn flex items-center">
              <Check size={20} className="mr-1" />
              Save Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClassModal;
