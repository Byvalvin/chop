// components/TabContainer.js
import React from 'react';
import Tab from './Tab';

const TabContainer = ({ activeTab, setActiveTab, tabs, swipeHandlers, children }) => {
  return (
    <div>
      {/* Tab Container */}
      <div className="flex justify-between bg-[var(--primary)] py-2 px-4 rounded-lg mb-6">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {/* Tab Content */}
      <div {...swipeHandlers}>
        {children}
      </div>
    </div>
  );
};

export default TabContainer;
