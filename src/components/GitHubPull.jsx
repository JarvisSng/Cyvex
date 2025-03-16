import React, { useState } from "react";
import { FaGithub } from "react-icons/fa";

const GitHubPull = ({ onSubmit }) => {
  const [repoLink, setRepoLink] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRepoChange = (event) => setRepoLink(event.target.value);

  const handlePullRepo = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const repoDetails = repoLink.replace("https://github.com/", "").split("/");
      if (repoDetails.length < 2) throw new Error("Invalid GitHub repository URL.");

      const apiUrl = `https://api.github.com/repos/${repoDetails[0]}/${repoDetails[1]}/contents/`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch repository contents.");

      const files = await response.json();
      const validFile = files.find(file => /\.(js|py|java|c|cpp)$/.test(file.name));
      if (!validFile) throw new Error("No valid source code file found.");

      const fileResponse = await fetch(validFile.download_url);
      if (!fileResponse.ok) throw new Error("Failed to fetch file content.");

      const fileText = await fileResponse.text();
      setFileName(validFile.name);
      setFileContent(fileText);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => {
    if (!fileContent.trim()) {
      alert("No code detected! Please pull a repository before scanning.");
      return;
    }
    onSubmit(fileContent, fileName.split(".").pop());
  };

  return (
    <main className="p-6 w-full flex flex-col items-center gap-6">
      <h1 className="text-2xl font-semibold">Pull GitHub Repository</h1>
      <p className="text-md text-gray-700">Enter a repository URL to pull its contents.</p>

      <div className="flex items-center border border-gray-400 rounded-lg p-3 bg-gray-100 w-full max-w-lg">
        <FaGithub size={24} className="text-black mr-2" />
        <input 
          type="text" 
          value={repoLink} 
          onChange={handleRepoChange}
          placeholder="https://github.com/user/repo"
          className="flex-1 p-2 bg-transparent text-black placeholder-gray-500 outline-none"
        />
        <button
          onClick={handlePullRepo}
          className="px-4 py-2 ml-2 !bg-blue-950 text-white rounded-md hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Pulling..." : "Pull"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {fileContent && (
        <div className="p-8 border border-gray-300 rounded-lg bg-gray-200 w-full max-w-md text-left shadow-md">
          <h3 className="text-xl text-black font-semibold mb-2">File: {fileName}</h3>
          <pre className="bg-gray-300 border-gray-200 p-3 rounded-md text-sm max-h-40 overflow-y-auto text-black">
            {fileContent.substring(0, 500)}...
          </pre>
          <button
            onClick={handleAnalyze}
            className="mt-6 px-6 py-2 !bg-blue-950 text-white rounded-md hover:bg-blue-600 transition"
          >
            Analyze Code
          </button>
        </div>
      )}
    </main>
  );
};

export default GitHubPull;
