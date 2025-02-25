import React, { useState } from 'react';

const CodeUploader = ({ onFileUpload, onPaste }) => {
  const [fileName, setFileName] = useState("No file chosen");
  const [pastedCode, setPastedCode] = useState("");
  const [dragging, setDragging] = useState(false);

  // Handle file upload via file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPastedCode(""); // Clear any pasted code
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const ext = file.name.split('.').pop();
        onFileUpload(content, ext);
      };
      reader.readAsText(file);
    }
  };

  // Handle drag over
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragging(false);
  };

  // Handle drop event
  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setPastedCode(""); // Clear pasted text when file is dropped
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const ext = file.name.split('.').pop();
        onFileUpload(content, ext);
      };
      reader.readAsText(file);
    }
  };

  // Handle code pasted into the textarea
  const handlePaste = (event) => {
    const text = event.target.value;
    setPastedCode(text);
    if (text.trim() !== "") {
      setFileName("No file chosen"); // Clear uploaded file name when pasting
      onPaste(text);
    }
  };

  // Clear uploaded file
  const clearFile = () => {
    setFileName("No file chosen");
    onFileUpload("", null);
  };

  // Clear pasted text
  const clearPastedText = () => {
    setPastedCode("");
    onPaste("");
  };

  return (
    <div
      style={{
        padding: '20px',
        border: dragging ? '2px dashed #00ff00' : '2px dashed #aaa',
        borderRadius: '5px',
        textAlign: 'center',
        backgroundColor: dragging ? '#333' : '#222',
        color: '#fff',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3>Upload or Paste Code</h3>

      {/* File Upload Section */}
      <div>
        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          accept=".js,.py,.java,.c,.cpp,.txt"
          style={{ display: 'none' }}
        />
        <button
          onClick={() => document.getElementById('fileInput').click()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Choose File
        </button>
        {fileName !== "No file chosen" && (
          <button
            onClick={clearFile}
            style={{
              marginLeft: '10px',
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Clear File
          </button>
        )}
        <p style={{ marginTop: '10px' }}>
          <strong>Selected File:</strong> {fileName}
        </p>
      </div>

      {/* Paste Code Section */}
      <div style={{ marginTop: '20px' }}>
        <textarea
          placeholder="Or paste your code here..."
          value={pastedCode}
          onChange={handlePaste}
          rows={8}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            color: '#000',
          }}
        ></textarea>
        {pastedCode && (
          <button
            onClick={clearPastedText}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Clear Text
          </button>
        )}
      </div>
    </div>
  );
};

export default CodeUploader;
