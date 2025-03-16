import React, { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const GitHubPull = () => {
  const [repoLink, setRepoLink] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); 

  const navigate = useNavigate();

	const login = () => {
		navigate("/login/email");
	};

	const detector = () => {
		navigate("/detector");
	};

  // Fetch subscription status when component mounts
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await fetch("/api/check-subscription", { credentials: "include" });
        const result = await response.json();

        if (result.isSubscribed) {
          setIsSubscribed(true);
        }
      } catch (err) {
        console.error("Error checking subscription:", err);
      }
    };

    checkSubscription();
  }, []);

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
      {/* Header (Fixed at the Top) */}
			<header className="bg-blue-950 absolute top-0 left-0 w-full py-4 px-8 shadow-md z-50 h-20">
				<div className="flex items-center justify-between w-full h-full">
					<h2 className="text-stone-50 text-4xl font-bold flex items-center">
						cyvex
					</h2>

					{/* Navigation Links (Centered) */}
					<nav className="flex items-center gap-8">
						<h2 className="text-stone-50 text-2xl font-bold cursor-pointer">
							solutions
						</h2>
						<h2 className="text-stone-50 text-2xl font-bold cursor-pointer">
							customers
						</h2>
						<h2 className="text-stone-50 text-2xl font-bold cursor-pointer">
							services
						</h2>
						<h2 className="text-stone-50 text-2xl font-bold cursor-pointer">
							insights
						</h2>
						<h2 className="text-stone-50 text-2xl font-bold cursor-pointer">
							company
						</h2>
					</nav>

					{/* Buttons (Right) */}
					<div className="flex items-center gap-4">
						<button
							onClick={login}
							className="w-32 bg-stone-50 text-black px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
						>
							Login
						</button>
						<button
							onClick={detector}
							className="w-32 bg-stone-50 text-black px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
						>
							Try It
						</button>
					</div>
				</div>
			</header>

      {/* Sidebar + Main Content Wrapper */}
      <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-gray-200 border-r border-gray-300 p-6 fixed top-20 left-0">
        <nav className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/detector")}
            className={`p-2 rounded-md text-left ${
              window.location.pathname === "/detector"
                ? "!bg-blue-950 text-white"
                : "hover:bg-gray-300"
            }`}
          >
            Upload Code
          </button>

          {isSubscribed && (
            <button
              onClick={() => navigate("/github-pull")}
              className={`p-2 rounded-md text-left ${
                window.location.pathname === "/github-pull"
                  ? "!bg-blue-950 text-white"
                  : "hover:bg-gray-300"
              }`}
            >
              Git Pull
            </button>
          )}

          <button
            onClick={() => navigate("/report")}
            className={`p-2 rounded-md text-left ${
              window.location.pathname === "/report"
                ? "!bg-blue-950 text-white"
                : "hover:bg-gray-300"
            }`}
          >
            View Results
          </button>
        </nav>
      </aside>


        {/* Main Content */}
        <main className="ml-64 p-6 w-full flex flex-col items-center gap-6">
          <h1 className="text-2xl font-semibold">Pull GitHub Repository</h1>
          <p className="text-md text-gray-700">Enter a repository URL to pull its contents.</p>

          <div className="flex items-center border border-gray-400 rounded-lg p-3 bg-gray-1000 w-full max-w-lg">
            <FaGithub size={24} className="text-black mr-2" />
            <input 
              type="text" 
              value={repoLink} 
              onChange={handleRepoChange}
              placeholder="https://github.com/user/repo"
              className="flex-1 p-2 bg-transparent text-black placeholder-gray-500 outline-none"
            />

            {/* Pull Button */}
            <button
              onClick={handlePullRepo}
              className="px-4 py-2 ml-2 !bg-blue-950 text-white rounded-md hover:bg-blue-600 transition"
            >
              {loading ? "Pulling..." : "Pull"}
            </button>
          </div>

          {/* Reserved Space for File Box */}
          <div className="mt-6 min-h-[200px]">
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
          </div>
        </main>
      </div>
    </>
  );
};

export default GitHubPull;
