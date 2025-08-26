import React, { useState } from "react";
import ReactDOM from "react-dom";
import { X, Lock } from "lucide-react";
import { useAuth } from "../Context/AuthContext";

const themes = [
  { 
    key: "orange", 
    label: "Orange", 
    color: "#DC4C3E",
    bgColor: "#F6F0EC",
    locked: false 
  },
  { 
    key: "kale", 
    label: "Kale", 
    color: "#3A5A40",
    bgColor: "#E6F0EC",
    locked: false 
  },
  { 
    key: "blueberry", 
    label: "Blueberry", 
    color: "#4A5FC1",
    bgColor: "#E8ECFB",
    locked: false 
  },
  { 
    key: "lavender", 
    label: "Lavender", 
    color: "#734b94",
    bgColor: "#F3E8F9",
    locked: false 
  },
  { 
    key: "raspberry", 
    label: "Raspberry", 
    color: "#C7365F",
    bgColor: "#FCE8F0",
    locked: false 
  },
];

// Standalone Theme Selector Component
const ThemeSelector = () => {
  const [selectedTheme, setSelectedTheme] = useState("kale");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-semibold mb-6">Choose Theme</h2>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        {themes.map((theme) => (
          <div key={theme.key} className="relative">
            <div
              className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all ${
                selectedTheme === theme.key && !theme.locked
                  ? "border-blue-500 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              } ${theme.locked ? "opacity-60 cursor-not-allowed" : ""}`}
              onClick={() => !theme.locked && setSelectedTheme(theme.key)}
            >
              {/* Theme Color Bar */}
              <div
                className="w-8 h-2 rounded-full mb-3"
                style={{ backgroundColor: theme.color }}
              ></div>

              {/* Theme Name and Radio Button */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">
                  {theme.label}
                </span>

                <div className="flex items-center gap-2">
                  {/* Radio Button */}
                  <div className="relative">
                    <input
                      type="radio"
                      name="theme"
                      value={theme.key}
                      checked={selectedTheme === theme.key && !theme.locked}
                      onChange={() =>
                        !theme.locked && setSelectedTheme(theme.key)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                      disabled={theme.locked}
                    />
                  </div>

                  {/* Lock Icon */}
                  {theme.locked && <Lock size={12} className="text-gray-400" />}
                </div>
              </div>

              {/* Theme Preview Lines */}
              <div className="mt-3 space-y-2">
                <div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: theme.bgColor, width: "80%" }}
                ></div>
                <div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: theme.bgColor, width: "60%" }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Theme Display */}
      <div className="mt-6 p-4 bg-white rounded-lg border max-w-md">
        <p className="text-sm text-gray-600">Selected Theme:</p>
        <p className="font-semibold capitalize">{selectedTheme}</p>
      </div>
    </div>
  );
};

const ProfileModal = ({ onClose }) => {
  const { user, theme, updateTheme,logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const modalContent = (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>

        {/* Profile Info (UPDATED STRUCTURE) */}
        <div className="flex items-center gap-4 pb-4 mb-6 border-b border-gray-200">
       
            <div
              className="w-16 h-16 flex items-center justify-center text-xl font-bold rounded-full shadow-sm"
              style={{
                backgroundColor: "var(--tab-active)",
                color: "var(--icon-color)",
                border: "2px solid var(--icon-color)",
              }}
            >
              {initials}
            </div>
          

          {/* Name & Email with Chip */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900">
              {user?.name}
            </h3>
            <span className="px-2 py-0.5 mt-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 w-fit">
              {user?.email}
            </span>
          </div>
        </div>

        {/* Theme Picker */}
        <h4 className="text-sm font-semibold mb-4">Choose Theme</h4>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((t) => (
            <div key={t.key} className="relative">
              <div
                className={`bg-gray-50 rounded-lg p-3 border-2 cursor-pointer transition-all ${
                  theme === t.key && !t.locked
                    ? "border-blue-500 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                } ${t.locked ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => !t.locked && updateTheme(t.key)}
              >
                {/* Theme Color Bar */}
                <div
                  className="w-6 h-2 rounded-full mb-3"
                  style={{ backgroundColor: t.color }}
                ></div>

                {/* Theme Name and Controls */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-800">
                    {t.label}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Radio Button */}
                    <div className="relative">
                      <input
                        type="radio"
                        name="theme"
                        value={t.key}
                        checked={theme === t.key && !t.locked}
                        onChange={() => !t.locked && updateTheme(t.key)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                        disabled={t.locked}
                      />
                    </div>

                    {/* Lock Icon */}
                    {t.locked && <Lock size={12} className="text-gray-400" />}
                  </div>
                </div>

                {/* Theme Preview Lines */}
                <div className="space-y-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ backgroundColor: t.bgColor, width: "75%" }}
                  ></div>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ backgroundColor: t.bgColor, width: "55%" }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
       <div className="mt-6 flex justify-end">
  <button
    onClick={() => {
      logout();   // call AuthContext logout
      onClose();  // close modal after logout
    }}
    className="px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors"
    style={{
      backgroundColor: "var(--icon-color)",
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--icon-color) 60%, transparent)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = "var(--icon-color)";
    }}
  >
    Logout
  </button>
</div>

      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

// Export both components
export { ThemeSelector };
export default ProfileModal;
