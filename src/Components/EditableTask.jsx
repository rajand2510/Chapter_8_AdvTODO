import React, { useRef, useEffect, useState } from "react";
import { Calendar, Flag, Bell, X, AlarmClock, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSubGroups, addTask, updateTask } from "../features/todoSlice";

const EditableTask = ({
  task: initialTask = null,
  dateTime: initialDateTime = null,
  priority: initialPriority = null,
  reminder: initialReminder = false,
  group: initialGroup = null,
  priorityOptions = [],
  setIsEditing,
  className,
  taskId,
}) => {
  const dispatch = useDispatch();

  // Separate date and time states
  const initDate = initialTask?.date
    ? new Date(initialTask.date).toISOString().slice(0, 10)
    : initialDateTime
      ? new Date(initialDateTime).toISOString().slice(0, 10)
      : "";

  const initTime = initialTask?.date
    ? new Date(initialTask.date).toISOString().slice(11, 16)
    : initialDateTime
      ? new Date(initialDateTime).toISOString().slice(11, 16)
      : "";

  const [task, setTask] = useState(initialTask || "");
  const [date, setDate] = useState(initDate);
  const [time, setTime] = useState(initTime);
  const [priority, setPriority] = useState(initialTask?.priority || initialPriority);
  const [reminder, setReminder] = useState(initialTask?.reminder || initialReminder);

  const [group, setGroup] = useState(() => {
    if (!taskId) {
      // ✅ Add mode → take subgroup from prop
      return initialGroup ? { _id: initialGroup._id, name: initialGroup.name } : null;
    } else {
      // ✅ Edit mode → take subgroup from existing task
      return initialTask?.subGroupId
        ? { _id: initialTask.subGroupId, name: initialTask.subGroupName }
        : null;
    }
  });



  const priorityRef = useRef(null);
  const groupRef = useRef(null);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const groupOptions = useSelector(selectAllSubGroups);
  console.log(groupOptions);
  // Compute combined ISO datetime
 const dateTime = date ? new Date(`${date}T${time || "00:00"}:00.000Z`).toISOString() : null;


  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (priorityRef.current && !priorityRef.current.contains(e.target))
        setPriorityOpen(false);
      if (groupRef.current && !groupRef.current.contains(e.target))
        setGroupOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 const formatDateTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${("0" + d.getUTCDate()).slice(-2)} ${d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" })}, ${("0" + d.getUTCHours()).slice(-2)}:${("0" + d.getUTCMinutes()).slice(-2)}`;
};

  // Save Task
  const handleSave = async () => {
    if (!task || !group) return alert("Please enter task and select group");

    const token = localStorage.getItem("token");
    const method = taskId ? "PUT" : "POST";
    const url = taskId
      ? `http://localhost:5000/api/tasks/${taskId}`
      : "http://localhost:5000/api/tasks";

    const payload = {
      text: task,
      priority: priority?.value || priority,
      date: dateTime, // ✅ store in "2025-08-21T03:51:00.000Z"
      reminder,
      subGroupId: group._id || group.id,

    };
    console.log(group._id, group.id);

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        if (method === "POST") dispatch(addTask(result));
        else dispatch(updateTask(result));
        setIsEditing(false);
      } else {
        throw new Error(result.message || "Failed to save task");
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div
      className={`flex flex-col w-full gap-3 p-4 bg-white rounded shadow-md max-w-4xl ${className}`}
    >
      {/* Task Title */}
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="w-full border rounded px-2 py-1 text-sm border-none focus:outline-none"
        placeholder="Task title"
      />

      {/* Selected chips */}
      <div className="flex flex-wrap gap-2">
        {dateTime && (
          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
            <Calendar size={14} />
            {formatDateTime(dateTime)}
            <X size={12} className="cursor-pointer ml-1" onClick={() => { setDate(""); setTime(""); }} />
          </span>
        )}
        {priority && (
          <span
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${priority.color}`}
          >
            <Flag size={14} /> {priority.label || priority}
            <X size={12} className="cursor-pointer ml-1" onClick={() => setPriority(null)} />
          </span>
        )}
        {group && (
          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
            # {group.name}
            <X size={12} className="cursor-pointer ml-1" onClick={() => setGroup(null)} />
          </span>
        )}
        {reminder && (
          <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
            <Bell size={14} /> Reminder
            <X size={12} className="cursor-pointer ml-1" onClick={() => setReminder(false)} />
          </span>
        )}
      </div>

      {/* Inputs */}
      <div className="flex flex-wrap gap-2">
        {/* Separate Date and Time */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-xs border border-gray-200 text-gray-500 rounded px-2 py-1"
        />
        <input
          type="time"
         value={time || "00:00"}  // show 00:00 if time is empty

          onChange={(e) => setTime(e.target.value)}
          className="text-xs border border-gray-200 text-gray-500 rounded px-2 py-1"
        />

        {/* Priority Dropdown */}
        <div className="relative" ref={priorityRef}>
          <button
            onClick={() => setPriorityOpen(!priorityOpen)}
            className={`flex items-center justify-between border border-gray-200 rounded px-2 py-1 text-xs w-32 hover:bg-gray-50 ${priority?.color || "text-gray-500"}`}
          >
            {priority ? priority.label || priority : "Select Priority"}
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

        {/* Group Dropdown */}
        <div className="relative" ref={groupRef}>
          <button
            onClick={() => setGroupOpen(!groupOpen)}
            className={`flex items-center justify-between border border-gray-200 rounded px-2 py-1 text-xs w-32 hover:bg-gray-50 ${group ? "text-gray-700" : "text-gray-500"}`}
          >
            {group ? group.name : "Select Group"}
            <ChevronDown size={12} className={`ml-1 transition-transform ${groupOpen ? "rotate-180" : ""}`} />
          </button>
          {groupOpen && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-50">
              {groupOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setGroup({ _id: option.id, name: option.name });
                    setGroupOpen(false);
                    console.log("Selected group id:", group._id); 
                  }}

                  className="w-full px-2 py-1 text-left text-xs flex items-center gap-2 hover:bg-gray-50 text-gray-700"
                >
                  {option.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reminder (enabled only if date & time are set) */}
        <button
          onClick={() => setReminder(!reminder)}
        disabled={!date || !time}  // reminder allowed only if both date and time are set

          className={`flex items-center gap-1 text-xs px-2 py-1 border rounded ${dateTime
            ? "text-gray-500 border-gray-200 hover:bg-gray-50"
            : "text-gray-300 border-gray-100 cursor-not-allowed"
            }`}
        >
          <AlarmClock size={14} /> {reminder ? "Remove Reminder" : "Add Reminder"}
        </button>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 text-sm">
        <button
          onClick={() => setIsEditing(false)}
          className="px-3 py-1 rounded bg-gray-100 text-gray-600"
        >
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
