import PropTypes from "prop-types";

export const ProgressBar = ({ value, className }) => {
  return (
    <div
      className={`h-2 w-full bg-gray-200 rounded-full overflow-hidden ${className}`}
    >
      <div
        className="h-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 transition-all duration-500 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
};
