const VideoPlayer = ({ project }) => {
  return (
    <div className="bg-gray-900 text-white flex items-center justify-center relative overflow-hidden w-full h-full">
      <iframe
        className="absolute top-0 left-0 bottom-0 right-0 w-full h-full"
        src={project.video}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
