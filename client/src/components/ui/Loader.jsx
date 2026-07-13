const Loader = ({ fullScreen = false }) => {
  const containerClasses = fullScreen
    ? "flex items-center justify-center min-h-screen"
    : "flex items-center justify-center py-8";

  return (
    <div className={containerClasses}>
      <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Loader;