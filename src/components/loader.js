const SIZE_CLASSES = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-4",
  lg: "h-12 w-12 border-4",
};

const Loader = ({ size = "md", fullScreen = false, label = "Loading..." }) => {
  const spinner = (
    <div
      role="status"
      className={`inline-block animate-spin rounded-full border-primary border-t-transparent ${SIZE_CLASSES[size]}`}
    >
      <span className="sr-only">{label}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;