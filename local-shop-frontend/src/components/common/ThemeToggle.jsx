// src/components/common/ThemeToggle.jsx

import React, { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

const ThemeToggle = () => {
  // Use a local state to prevent hydration mismatch issues with SSR frameworks
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useThemeStore();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a placeholder or nothing on the server/initial render
    return <div className="w-10 h-10"></div>; 
  }

  const options = [
    { value: 'light', icon: <FiSun />, label: 'Light' },
    { value: 'dark', icon: <FiMoon />, label: 'Dark' },
    { value: 'system', icon: <FiMonitor />, label: 'System' },
  ];
  
  const currentOption = options.find(opt => opt.value === theme);

  return (
    <div className="relative group">
      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-primary transition-colors">
        {currentOption.icon}
      </button>
      <div className="absolute right-0 mt-2 w-36 bg-slate-800 border border-slate-700 rounded-md shadow-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              theme === option.value
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
            }`}
          >
            {option.icon}
            <span className="ml-2">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;