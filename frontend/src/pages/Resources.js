import React, { useState, useEffect } from 'react';
import '../Resources.css';

const Resources = () => {

    return (
        <div className="resources-container">
        <div className="resources-header h-[69px]">
          <div className="resources-title-container">
            <h1 className="resources-title">Resources</h1>
          </div>
          <div className="flex justify-end pr-[32px]">
            <button className="resources-button">Add File</button>
          </div>
        </div>
        
        <div className="resources-filter px-[32px] py-3 border-b">
            <button
                className="px-4 py-2 rounded-[16px] text-black text-[14px]"
                style={{ backgroundColor: '#f7f8fa' }}
            >
                All
            </button>
        </div>
        <div className="resources-content">
          
        </div>
      </div>
);
}

export default Resources;