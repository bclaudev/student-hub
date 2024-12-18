// src/pages/HomePage.js
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Sidebar from '../components/Sidebar.js';
import '../CalendarStyles.css';

// Moment configuration to start from Monday -> Idea: Make this changable in settings
moment.updateLocale("en", {
  week: {
    dow: 1,
  },
});

const localizer = momentLocalizer(moment);

const events = [];

const HomePage = () => {
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  
    return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          isMinimized={isSidebarMinimized}
          toggleSidebar={() => setIsSidebarMinimized(!isSidebarMinimized)}
        />
  
        {/* Calendar */}
        <div className="flex-1 h-full">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            className="h-full w-full"
          />
        </div>
      </div>
    );
  };

  export default HomePage;