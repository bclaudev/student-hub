import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Resources.css';

const Resources = () => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/resources', {
        withCredentials: true, // needed to send cookies (auth token)
      });
      setFiles(res.data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:4000/api/upload', formData, {
        withCredentials: true, // include cookies for auth
      });
      fetchFiles(); // refresh file list
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="resources-container">
      <div className="resources-header h-[69px]">
        <h1 className="resources-title">Resources</h1>
        <button className="resources-button" onClick={() => document.getElementById('file-input').click()}>
          Add File
        </button>
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      <div className="resources-content px-[32px] py-[20px]">
        {files.map((file) => (
          <div key={file.id} className="resource-item flex items-center gap-4 mb-4">
            {file.fileType.startsWith('image/') ? (
              <img
                src={`http://localhost:4000${file.filePath}`}
                alt={file.name}
                className="w-[60px] h-[60px] object-cover rounded"
              />
            ) : (
              <div className="w-[60px] h-[60px] bg-gray-200 rounded flex items-center justify-center text-2xl">
                📄
              </div>
            )}
            <div>
              <p className="font-semibold">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.fileSize / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;
