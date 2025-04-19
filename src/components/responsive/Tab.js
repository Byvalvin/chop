// components/Tab.js
import React from 'react';

const Tab = ({ id, label, isActive, onClick }) => {
  return (
    <div
      className={`flex-1 text-center py-3 px-4 rounded-lg font-bold ${
        isActive
          ? "bg-[var(--primary-cmpmt)] text-[var(--primary)]"
          : "text-[var(--primary-cmpmt)]"
      } transition duration-200`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default Tab;
