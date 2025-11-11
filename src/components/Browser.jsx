"use client";
import { useEffect, useRef, useState } from "react";
import { Copy, Globe, Home, RotateCcw, X } from "lucide-react";
import { noImage2 } from "@/constants";
import toast from "react-hot-toast";
import ProjectsPage from "./ProjectsPage";
import VideoPlayer from "./VideoPlayer";

const Browser = () => {
  const [activeProject, setActiveProject] = useState("home");
  const [isClosed, setIsClosed] = useState(
    localStorage.getItem("isClosed") || false
  );
  const [projects, setProjects] = useState([]);
  const [url, setUrl] = useState("");
  const [key, setKey] = useState(0);
  const iframeRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/project`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects data");
      }

      const data = await response.json();

      setProjects(data);
    } catch (err) {
      toast.error("Failed to load projects data.");
    }
  };

  const setIsClosedAlert = (isClosed) => {
    localStorage.setItem("isClosed", isClosed);
    setIsClosed(isClosed);
  };

  const handleCopyUrl = () => {
    if (url.length > 0) {
      navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
    }
  };

  const handleReload = () => setKey((prev) => prev + 1);

  return (
    <div className="w-full h-full bg-gray-900 flex flex-col">
      <div className="bg-gray-800 text-white flex items-center px-1 pt-1 gap-1 h-8">
        <button
          className={`px-2 py-1 rounded-t-md flex items-center gap-2 h-7 ${
            activeProject === "home"
              ? "bg-gray-700"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
          onClick={() => {
            setActiveProject("home");
            setUrl("");
          }}
        >
          <Home size={16} />
        </button>
        {projects &&
          projects.map(
            (project) =>
              project.clickable && (
                <button
                  key={project._id}
                  className={`px-2 py-1 rounded-t-md min-w-8 h-7 ${
                    activeProject === project._id
                      ? "bg-gray-700"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                  onClick={() => {
                    setActiveProject(project._id);
                    setUrl(project.url);
                  }}
                >
                  <div className="flex items-center gap-2 w-full h-full overflow-hidden">
                    {project.image?.length > 0 ? (
                      <img
                        src={project.image || noImage2}
                        alt={project.title}
                        className="w-4 h-4"
                      />
                    ) : (
                      <Globe size={16} />
                    )}
                    <p className="text-sm text-nowrap">{project.title}</p>
                  </div>
                </button>
              )
          )}
      </div>

      <div className="bg-gray-700 flex items-center px-1 py-1 gap-1 h-8">
        <button
          className="text-white p-1 mx-1 hover:bg-gray-600 rounded"
          onClick={handleReload}
        >
          <RotateCcw size={16} />
        </button>
        <div className="relative flex-grow flex items-center">
          <input
            type="text"
            className="w-full bg-gray-900 text-white hover:bg-gray-600 px-2 py-1 rounded outline-none cursor-pointer h-6 text-sm"
            value={url}
            readOnly
            placeholder="https://"
            onClick={handleCopyUrl}
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
            onClick={handleCopyUrl}
          >
            <Copy size={14} />
          </button>
        </div>
      </div>

      <div className="flex-grow w-full h-full bg-gray-100 rounded-b-md bottom-0">
        {activeProject === "home" ? (
          <ProjectsPage setActiveProject={setActiveProject} setUrl={setUrl} />
        ) : projects.find((project) => project._id === activeProject)?.video ? (
          <VideoPlayer
            project={projects.find((project) => project._id === activeProject)}
          />
        ) : (
          <div className="flex-grow w-full h-full">
            <div
              className={`bg-gray-800 flex items-center justify-between w-full max-h-16 pl-2 pr-1 py-1 gap-1 ${
                isClosed ? "scale-y-0 absolute" : "scale-y-100 relative"
              } transition-all ease-in-out duration-500 origin-top`}
            >
              <span className="text-sm">
                It should be better experience if you open projects in your
                actual browser
              </span>
              <button
                className="text-white p-1 mx-1 hover:bg-gray-600 rounded"
                onClick={() => setIsClosedAlert(true)}
              >
                <X size={16} />
              </button>
            </div>
            <iframe
              key={key}
              ref={iframeRef}
              className={`w-full h-full  transition-all ease-in-out duration-500`}
              src={
                projects.find((project) => project._id === activeProject)?.url
              }
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-storage-access-by-user-activation"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browser;
