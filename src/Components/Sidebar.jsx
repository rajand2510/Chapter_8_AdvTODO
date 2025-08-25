import {
  Calendar1Icon,
  ChevronDown,
  ChevronRight,
  PanelRight,
  Plus,
  PlusCircle,
} from "lucide-react";
import React, { useState } from "react";
import { CalendarDays, Clock, CheckCircle, Sun } from "lucide-react";
const Sidebar = ({ fullName = "Rajan Dhariyaparmar" }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [color, setColor] = useState("#4A5FC1");
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const [activeTab, setActiveTab] = useState("Today");

  const menuItems = [
    { id: "today", name: "Today", icon: <Calendar1Icon strokeWidth={1} size={22} /> },
    { id: "upcoming", name: "Upcoming", icon: <Clock strokeWidth={1} size={22} /> },
    { id: "calendar", name: "Calendar", icon: <CalendarDays strokeWidth={1} size={22} /> },
    { id: "completed", name: "Completed", icon: <CheckCircle strokeWidth={1} size={22} /> },
  ];

  const menuItems1 = [
    { id: "home", name: "Home", icon: <Calendar1Icon strokeWidth={1} size={22} /> },
    { id: "hello", name: "Hello", icon: <Clock strokeWidth={1} size={22} /> },
    { id: "hey", name: "Hey", icon: <CalendarDays strokeWidth={1} size={22} /> },
    { id: "work", name: "Work", icon: <CheckCircle strokeWidth={1} size={22} /> },
  ];

  const firstName = fullName.split(" ")[0];
  const nameParts = fullName.split(" ");
  const initials =
    nameParts.length > 1
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
      : nameParts[0][0].toUpperCase();

  return (
    <div className="sticky top-0 left-0 h-screen ">
      {/* Sidebar container with transition */}
      <div
        className={`h-screen flex flex-col transition-all duration-300 ease-in-out 
          ${isOpen ? "w-[310px] opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-full"}
        `}
        style={{ backgroundColor: "var(--sidebar-bg)" }}
      >
        {/* Sidebar content */}
        {isOpen && (
          <>
            <div className="flex flex-row items-center justify-between p-4">
              {/* Left side: profile + name */}
              <span className="flex items-center gap-3 hover:bg-gray-400/15 p-1 rounded-lg">
                <div
                  className="w-7 h-7 flex items-center justify-center text-xs rounded-full"
                  style={{
                    backgroundColor: "var(--tab-active)",
                    color: "var(--icon-color)",
                    border: "1px solid var(--icon-color)",
                  }}
                >
                  {initials}
                </div>
                <h4 className="text-sm font-semibold text-gray-800">{firstName}</h4>
                <ChevronDown size={16} />
              </span>

              {/* Right side: toggle button */}
              <span
                className="cursor-pointer p-1 rounded-lg hover:bg-gray-400/15 active:scale-90 active:text-gray-700 transition-all duration-150 ease-in-out"
                onClick={handleToggle}
              >
                <PanelRight
                  size={22}
                  strokeWidth={1.5}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                />
              </span>
            </div>
            <div className="px-2 flex flex-col h-full">
              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                {/* Add Task */}
                <div className="p-2 px-3 rounded-lg gap-2 flex hover:bg-black/5 items-center cursor-pointer">
                  <span
                    style={{ backgroundColor: "var(--icon-color)" }}
                    className="w-6 h-6 flex items-center justify-center rounded-full transition"
                  >
                    <Plus size={16} className="text-white" />
                  </span>
                  <span
                    style={{ color: "var(--icon-color)" }}
                    className="text-sm font-medium transition"
                  >
                    Add Task
                  </span>
                </div>

                {/* Menu Items */}
                {menuItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className="p-2 px-3 rounded-lg gap-2 flex items-center cursor-pointer transition hover:bg-black/5"
                      style={{
                        backgroundColor: isActive ? "var(--tab-active)" : "",
                      }}
                    >
                      <span
                        className="w-6 h-6 flex items-center justify-center rounded-full transition"
                        style={{
                          color: isActive ? "var(--icon-color)" : "#6B7280",
                        }}
                      >
                        {item.icon}
                      </span>
                      <span
                        className="text-sm transition"
                        style={{
                          color: isActive ? "var(--icon-color)" : "#111827",
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                  );
                })}

                {/* Personal Goals */}
                <div className="mt-2">
                  <div className="p-2 px-3 rounded-lg gap-2 flex items-center cursor-pointer justify-between hover:bg-black/5 group">
                    <span className="text-sm text-gray-500 font-medium transition">
                      Personal Goals
                    </span>

                    {/* icons container */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="p-[2px] rounded-lg hover:bg-black/5">
                        <Plus size={20} strokeWidth={1} />
                      </span>
                      <span className="p-[2px] rounded-lg hover:bg-black/5">
                        <ChevronDown size={20} strokeWidth={1} />
                      </span>
                    </div>
                  </div>


                  {menuItems1.map((item) => {
                    const isActive = activeTab === item.name;
                    return (
                      <div
                        key={item.name}
                        onClick={() => setActiveTab(item.name)}
                        className="p-2 px-3 rounded-lg gap-2 flex items-center cursor-pointer transition hover:bg-black/5"
                        style={{
                          backgroundColor: isActive ? "var(--tab-active)" : "",
                        }}
                      >
                        <span
                          className="w-6 text-lg h-6 flex items-center justify-center rounded-full transition"
                          style={{ color }}
                        >
                          #
                        </span>
                        <span
                          className="text-sm transition"
                          style={{
                            color: isActive ? "var(--icon-color)" : "#111827",
                          }}
                        >
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fixed bottom "Add Group" */}
              <div className="p-2 px-3 rounded-lg gap-2 flex hover:bg-black/5 text-gray-600 hover:text-black items-center cursor-pointer">
                <span className="p-[2px] rounded-lg hover:bg-black/5">
                  <Plus size={20} strokeWidth={1} />
                </span>
                <span className="hover:text-black text-sm font-medium transition">
                  Add a Group
                </span>
              </div>
            </div>

          </>
        )}
      </div>

      {/* Floating toggle button when sidebar is closed */}
      {!isOpen && (
        <span
          className="absolute top-4 left-4 cursor-pointer p-1 rounded-lg  hover:bg-gray-100 active:scale-90 transition-all duration-150 ease-in-out "
          onClick={handleToggle}
        >
          <PanelRight
            size={22}
            strokeWidth={1.5}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          />
        </span>
      )}
    </div>
  );
};

export default Sidebar;
