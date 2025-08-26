import React, { useRef, useEffect } from "react";
import { Calendar, Flag, Bell, X, AlarmClock, ChevronDown } from "lucide-react";

const EditableTask = ({
  task: initialTask = "",
  setTask: _setTask,
  dateTime: initialDateTime = null,
  setDateTime: _setDateTime,
  priority: initialPriority = null,
  setPriority: _setPriority,
  reminder: initialReminder = false,
  setReminder: _setReminder,
  group: initialGroup = null,
  setGroup: _setGroup,
  priorityOptions = [],
  groupOptions = [],
  isEditing ,
  setIsEditing,
  onSave, // New callback
  className
}) => {
  const [task, setTask] = React.useState(initialTask);
  const [dateTime, setDateTime] = React.useState(initialDateTime);
  const [priority, setPriority] = React.useState(initialPriority);
  const [reminder, setReminder] = React.useState(initialReminder);
  const [group, setGroup] = React.useState(initialGroup);

  const priorityRef = useRef(null);
  const groupRef = useRef(null);
  const [priorityOpen, setPriorityOpen] = React.useState(false);
  const [groupOpen, setGroupOpen] = React.useState(false);

  // Close dropdowns when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (priorityRef.current && !priorityRef.current.contains(e.target)) setPriorityOpen(false);
      if (groupRef.current && !groupRef.current.contains(e.target)) setGroupOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format date/time nicely
  const formatDateTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSave = () => {
    // Call callback to create a new task
    onSave?.({
      task,
      dateTime,
      priority,
      reminder,
      group,
    });
    setIsEditing && setIsEditing(false);
    _setTask && _setTask(task);
    _setDateTime && _setDateTime(dateTime);
    _setPriority && _setPriority(priority);
    _setReminder && _setReminder(reminder);
    _setGroup && _setGroup(group);
  };

  return (
    <div className={`flex flex-col w-full gap-3 p-4 bg-white rounded shadow-md max-w-4xl ${className}`}>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="w-full border rounded px-2 py-1 text-sm border-none focus:outline-none"
        placeholder="Task title"
      />

      {/* Selected badges */}
      <div className="flex flex-wrap gap-2">
        {dateTime && (
          <span
            style={{
              backgroundColor: "var(--sidebar-bg)",
              color: "var(--icon-color)",
              border: "var(--icon-color) 1px solid",
            }}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
          >
            <Calendar size={14} />
            {formatDateTime(dateTime)}
            <X size={12} className="cursor-pointer ml-1" onClick={() => setDateTime(null)} />
          </span>
        )}
        {priority && (
          <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${priority.color}`}>
            <Flag size={14} /> {priority.label}
            <X size={12} className="cursor-pointer ml-1" onClick={() => setPriority(null)} />
          </span>
        )}
        {reminder && (
          <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
            <Bell size={14} /> Reminder
            <X size={12} className="cursor-pointer ml-1" onClick={() => setReminder(false)} />
          </span>
        )}
      </div>

      {/* Add inputs */}
      <div className="flex flex-wrap gap-2">
        <input
          type="datetime-local"
          value={dateTime ? dateTime.slice(0, 16) : ""}
          onChange={(e) => setDateTime(e.target.value)}
          className="text-xs border border-gray-200 text-gray-500 rounded px-2 py-1"
        />

        {/* Priority dropdown */}
        <div className="relative" ref={priorityRef}>
          <button
            onClick={() => setPriorityOpen(!priorityOpen)}
            className={`flex items-center justify-between border border-gray-200 rounded px-2 py-1 text-xs w-32 hover:bg-gray-50 ${
              priority?.color || "text-gray-500"
            }`}
          >
            {priority ? priority.label : "Select Priority"}
            <ChevronDown size={12} className={`ml-1 transition-transform ${priorityOpen ? "rotate-180" : ""}`} />
          </button>
          {priorityOpen && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-50">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setPriority(option);
                    setPriorityOpen(false);
                  }}
                  className={`rounded px-2 py-1 m-2 text-left text-xs flex items-center gap-2 hover:bg-gray-50 ${option.color}`}
                >
                  <Flag size={12} /> {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Group dropdown */}
        <div className="relative" ref={groupRef}>
          <button
            onClick={() => setGroupOpen(!groupOpen)}
            className={`flex items-center justify-between border border-gray-200 rounded px-2 py-1 text-xs w-32 hover:bg-gray-50 ${
              group ? "text-gray-700" : "text-gray-500"
            }`}
          >
            {group ? group.label : "Select Group"}
            <ChevronDown size={12} className={`ml-1 transition-transform ${groupOpen ? "rotate-180" : ""}`} />
          </button>
          {groupOpen && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-50">
              {groupOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setGroup(option);
                    setGroupOpen(false);
                  }}
                  className="w-full px-2 py-1 text-left text-xs flex items-center gap-2 hover:bg-gray-50 text-gray-700"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setReminder(!reminder)}
          className="flex items-center gap-1 text-xs px-2 py-1 text-gray-500 border-gray-200 border rounded hover:bg-gray-50"
        >
          <AlarmClock size={14} /> {reminder ? "Remove Reminder" : "Add Reminder"}
        </button>
      </div>

      {/* Save / Cancel */}
      <div className="flex justify-end gap-2 text-sm">
        <button onClick={() => setIsEditing(false)} className="px-3 py-1 rounded bg-gray-100 text-gray-600">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1 rounded text-white"
          style={{ backgroundColor: "var(--icon-color)" }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditableTask;
