// components/Pill.js
const Pill = ({ text, onDelete, bgColor, textColor }) => {
    return (
      <span
        className={`bg-${bgColor} text-${textColor} px-3 py-1 rounded-full text-sm flex items-center gap-2 cursor-pointer relative`}
        onClick={onDelete}  // Deletion happens when the pill is clicked
      >
        {/* Text that is shown by default */}
        <span className="transition-opacity duration-200">{text}</span>
        
        {/* "X" that appears only on hover */}
        <span className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100">
          <span className="text-xl text-red-600">×</span>
        </span>
      </span>
    );
  };
  
  export default Pill;
  