import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { MoreHorizontal, Calendar, Clock, Bell, Edit, Trash2, Flag } from "lucide-react";

const priorityOptions = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-700" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  { value: "high", label: "High", color: "bg-red-100 text-red-700" },
];

const customStyles = {
  control: (base) => ({
    ...base,
    background: "transparent",
    border: "none",
    boxShadow: "none",
    cursor: "pointer",
    minHeight: "28px",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0px",
  }),
  indicatorSeparator: () => ({ display: "none" }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 4px",
  }),
  menu: (base) => ({
    ...base,
    fontSize: "0.875rem", // text-sm
  }),
};

export function TaskActions({ onEdit, onDelete, onReminder, onChange }) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [priority, setPriority] = useState(null);

  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (field, value) => {
    if (field === "date") setSelectedDate(value);
    if (field === "time") setSelectedTime(value);
    if (field === "priority") setPriority(value);

    onChange?.({
      date: field === "date" ? value : selectedDate,
      time: field === "time" ? value : selectedTime,
      priority: field === "priority" ? value : priority,
    });
    setOpen(false);
  };

  const formatOptionLabel = ({ label, color }) => (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>{label}</span>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded hover:bg-gray-100"
      >
        <MoreHorizontal size={18} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-sm z-50">
          {/* Edit */}
          <button
            onClick={() => {
              onEdit?.();
              setOpen(false);
            }}
            className="flex items-center w-full px-2 py-2 rounded hover:bg-gray-50"
          >
            <Edit className="mr-2 h-4 w-4 text-gray-600" /> Edit
          </button>

          {/* Date */}
          <div className="flex items-center gap-2 px-2 py-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleChange("date", e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm cursor-pointer"
            />
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 px-2 py-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => handleChange("time", e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm cursor-pointer"
            />
          </div>

          {/* Priority */}
          <div className="flex items-center gap-2 px-2 py-2">
            <Flag className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <Select
                options={priorityOptions}
                value={priority}
                onChange={(val) => handleChange("priority", val)}
                styles={customStyles}
                formatOptionLabel={formatOptionLabel}
                placeholder="Select Priority"
                isSearchable={false}
              />
            </div>
          </div>

          {/* Reminder */}
          <button
            onClick={() => {
              onReminder?.();
              setOpen(false);
            }}
            className="flex items-center w-full px-2 py-2 rounded hover:bg-gray-50"
          >
            <Bell className="mr-2 h-4 w-4 text-gray-600" /> Add Reminder
          </button>

          {/* Divider */}
          <div className="border-t border-gray-200 my-1"></div>

          {/* Delete */}
          <button
            onClick={() => {
              onDelete?.();
              setOpen(false);
            }}
            className="flex items-center w-full px-2 py-2 rounded text-red-500 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
