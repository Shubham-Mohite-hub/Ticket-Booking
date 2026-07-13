const ScreenIndicator = () => {
  return (
    <div className="flex flex-col items-center mb-10">
      <div className="w-full max-w-2xl h-2.5 rounded-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 shadow-inner" />
      <p className="mt-2 text-xs tracking-[0.3em] text-gray-400 font-medium">SCREEN</p>
    </div>
  );
};

export default ScreenIndicator;