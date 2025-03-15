import React, { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const GitHubPull = () => {
  const [repoLink, setRepoLink] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRepoChange = (event) => {
    setRepoLink(event.target.value);
  };

  const getRepoDetails = (url) => {
    if (!url.startsWith("https://github.com/")) return null;
    const parts = url.replace("https://github.com/", "").split("/");
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  };

  const handlePullRepo = async () => {
    setError(null);
    setLoading(true);

    const repoDetails = getRepoDetails(repoLink);
    if (!repoDetails) {
      setError("Invalid GitHub repository URL.");
      setLoading(false);
      return;
    }

    const { owner, repo } = repoDetails;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`GitHub API Error: ${response.statusText}`);

      const files = await response.json();
      const validFile = files.find(file =>
        file.type === "file" && /\.(js|py|java|c|cpp)$/.test(file.name)
      );

      if (!validFile) {
        setError("No valid source code file found in the repository.");
        setLoading(false);
        return;
      }

      const fileResponse = await fetch(validFile.download_url);
      if (!fileResponse.ok) throw new Error("Failed to fetch the file content.");

      const fileText = await fileResponse.text();
      setFileName(validFile.name);
      setFileContent(fileText);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => {
    if (!fileContent.trim()) {
      alert("No code detected! Please pull a repository before scanning.");
      return;
    }

    navigate("/detector", { state: { pulledCode: fileContent, fileName } });
  };

  return (
    <>
      {/* Header */}
      <header className="bg-blue-950 fixed top-0 left-0 w-full py-4 px-8 shadow-md z-50 h-20">
        <div className="flex items-center justify-between w-full h-full">
          {/* Logo */}
          <h2 className="text-stone-50 text-4xl font-bold">cyvex</h2>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            <h2 className="text-stone-50 text-2xl font-bold cursor-pointer">solutions</h2>
            <h2 className="text-stone-50 text-2xl font-bold cursor-pointer">customers</h2>
            <h2 className="text-stone-50 text-2xl font-bold cursor-pointer">services</h2>
            <h2 className="text-stone-50 text-2xl font-bold cursor-pointer">insights</h2>
            <h2 className="text-stone-50 text-2xl font-bold cursor-pointer">company</h2>
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button className="w-32 bg-stone-50 text-black px-6 py-2 rounded-md hover:bg-blue-600">
              Login
            </button>
            <button className="w-32 bg-stone-50 text-black px-6 py-2 rounded-md hover:bg-blue-600">
              Try It
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar + Main Content Wrapper */}
      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className="w-64 h-screen bg-gray-200 text-black p-6 fixed top-20 left-0">
          <nav className="flex flex-col gap-4">
            <a href="/detector" className="hover:bg-gray-300 p-2 rounded-md">Upload Code</a>
						<div className="ml-4">
							<a
								href="/github-pull"
								className="hover:bg-gray-400 p-2 rounded-md text-blue-700"
							>
								● Git Pull
							</a>
						</div>
            <a href="/report" className="hover:bg-gray-300 p-2 rounded-md">View Results</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex flex-col items-center w-full min-h-screen">
          <div className="mt-[5.5rem] w-full max-w-lg text-center">
            <h1 className="text-2xl font-semibold text-black-100 tracking-wide whitespace-nowrap">Pull GitHub Repository</h1>
            <p className="text-md text-left text-black-400 mt-5">Enter a repository URL to pull its contents.</p>

            <div className="flex items-center border border-gray-400 rounded-lg p-3 bg-gray-1000 w-full mt-6">
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
                className="px-4 py-2 ml-2 bg-blue-600 hover:bg-blue-500 text-black rounded-md transition"
                disabled={loading}
              >
                {loading ? "Pulling..." : "Pull"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 mt-3">{error}</p>}

          {fileContent && (
            <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-blue-950 w-full max-w-md text-left shadow-md">
              <h3 className="text-xl text-white font-semibold mb-2">File: {fileName}</h3>
              <pre className="bg-gray-200 p-3 rounded-md text-sm max-h-40 overflow-y-auto text-white-800">
                {fileContent.substring(0, 500)}...
              </pre>
              <button
                onClick={handleAnalyze}
                className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-black rounded-lg transition"
              >
                Analyze Code
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default GitHubPull;
