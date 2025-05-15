import React, { useState } from 'react';

const CodeUploader = ({ onFileUpload, onPaste, onSubmit }) => {
  const [fileName, setFileName] = useState("No file chosen");
  const [pastedCode, setPastedCode] = useState("");
  const [dragging, setDragging] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [fileExt, setFileExt] = useState("");
  const [activeInput, setActiveInput] = useState(null); // Track whether file or paste is active

  // Handle file upload via file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPastedCode(""); // Clear any pasted code
      setFileName(file.name);
      setActiveInput('file');
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const ext = file.name.split('.').pop();
        setFileContent(content);
        setFileExt(ext);
        onFileUpload(content, ext); // Call the prop function
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
      setPastedCode("");
      setFileName(file.name);
      setActiveInput('file');
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const ext = file.name.split('.').pop();
        setFileContent(content);
        setFileExt(ext);
        onFileUpload(content, ext);
      };
      reader.readAsText(file);
    }
  };

  // Handle code pasted into the text area
  const handlePasteChange = (event) => {
    const text = event.target.value;
    setPastedCode(text);
    setFileContent(text); // Also store in fileContent for submission
    setFileExt("txt"); // Default extension for pasted text
    setActiveInput('paste');
    onPaste(text); // Call the prop function
  };

  // Clear uploaded file
  const clearFile = () => {
    setFileName("No file chosen");
    setFileContent("");
    setActiveInput(null);
    onFileUpload("", null);
  };

  // Clear pasted text
  const clearPastedText = () => {
    setPastedCode("");
    setFileContent("");
    setActiveInput(null);
    onPaste("");
  };

  // Submit uploaded or pasted text
  const handleSubmit = () => {
    if (!fileContent.trim()) {
      alert("Please upload a file or paste code before submitting.");
      return;
    }
    
    // Determine which content to submit
    const contentToSubmit = activeInput === 'file' ? fileContent : pastedCode;
    const extToSubmit = activeInput === 'file' ? fileExt : 'txt';
    
    onSubmit(contentToSubmit, extToSubmit);
  };

  return (
    <div
      className={`p-5 border-2 ${
        dragging ? "border-green-500 bg-gray-300" : "border-gray-400 bg-gray-200"
      } rounded-md text-center text-white`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3 className="text-black text-lg font-semibold">Upload or Paste Code</h3>
  
      {/* File Upload Section */}
      <div className="mt-4">
        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          accept=".js,.py,.java,.c,.cpp,.txt"
          className="hidden"
        />
        <button
          onClick={() => document.getElementById('fileInput').click()}
          className="px-4 py-2 !bg-blue-950 text-white rounded-md hover:bg-blue-600 transition"
        >
          Choose File
        </button>

        {fileName !== "No file chosen" && (
          <div className="mt-3 flex gap-3 justify-center">
            <button
              onClick={clearFile}
              className="px-4 py-2 !bg-blue-950 text-white rounded-md hover:bg-red-600 transition"
            >
              Clear File
            </button>
          </div>
        )}

        <p className="text-black mt-2">
          <strong>Selected File:</strong> {fileName}
        </p>
      </div>
  
      {/* Paste Code Section */}
      <div className="mt-5">
        <textarea
          placeholder="Or paste your code here..."
          value={pastedCode}
          onChange={handlePasteChange}
          rows={8}
          className="w-full p-2 rounded-md border border-gray-400 bg-white text-black"
        ></textarea>

        {pastedCode && (
          <div className="mt-3 flex justify-center gap-3">
            <button
              onClick={clearPastedText}
              className="px-4 py-2 !bg-blue-950 text-white rounded-md hover:bg-red-600 transition"
            >
              Clear Text
            </button>
          </div>
        )}

        {/* Submit Button - Now at the bottom for both options */}
        {(pastedCode || fileName !== "No file chosen") && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!fileContent.trim()}
              className="px-6 py-3 !bg-blue-950 text-white rounded-md transition disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeUploader;