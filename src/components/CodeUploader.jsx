import React, { useState } from 'react';

const CodeUploader = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState("No file chosen");
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);  // ✅ Update file name in UI
      readFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);  // ✅ Update file name in UI
      readFile(file);
    }
  };

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onFileUpload(e.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div
      style={{
        margin: '20px 0',
        padding: '20px',
        border: `2px dashed ${dragging ? '#007bff' : '#aaa'}`,
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: '#222',
        color: '#fff',
        borderRadius: '5px',
        transition: 'border 0.3s, background 0.3s'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput').click()} // Clickable behavior
    >
      <input
        id="fileInput"
        type="file"
        accept=".js,.txt"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <p style={{ margin: '10px 0', fontSize: '16px', color: '#bbb' }}>
        Drag and drop your file here, or click to upload.
      </p>

      <span
        style={{
          display: 'inline-block',
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Choose File
      </span>

      {/* ✅ Display uploaded file name */}
      <p style={{ marginTop: '10px', fontSize: '14px', color: '#ccc' }}>
        <strong>Selected File:</strong> {fileName}
      </p>
    </div>
  );
};

export default CodeUploader;
