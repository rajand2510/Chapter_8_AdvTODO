import {
    AlarmClock,
    Calendar,
    CheckCircle,
    Circle,
    ListFilter,
    MoreHorizontal,
    X,
    Flag,
    Bell,
    Clock,
} from "lucide-react";
import React, { useState } from "react";
import { TaskActions } from "./TaskActions";

const TodayTask = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [task, setTask] = useState("Take kids to the park after work tom");

    // Meta states
    const [dateTime, setDateTime] = useState(null);
    const [priority, setPriority] = useState(null);
    const [reminder, setReminder] = useState(false);
    const [group, setGroup] = useState(null); // new group state

    const priorityOptions = [
        { value: "high", label: "High", color: "bg-red-100 text-red-700" },
        { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700" },
        { value: "low", label: "Low", color: "bg-green-100 text-green-700" },
    ];

    const groupOptions = [
        { value: "home", label: "Home" },
        { value: "work", label: "Work" },
        { value: "personal", label: "Personal" },
    ];

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

    return (
        <div className="w-full">
            {/* HEADER */}
            <header className="p-5 flex justify-end">
                <div className="relative w-6 h-6">
                    <Circle className="absolute inset-0 text-gray-500" strokeWidth={1.5} />
                    <ListFilter className="absolute inset-0 m-auto w-3.5 h-3.5 text-gray-700" />
                </div>
            </header>

            <div className="flex flex-col max-w-4xl mx-auto w-full">
                <h3 className="text-3xl font-bold">Today</h3>
                <div className="mt-4">
                    <h3 className="text-sm font-bold border-b border-gray-200 pb-2">
                        Overdue
                    </h3>

                    <div className="flex flex-col w-full gap-2 p-3 border-b border-gray-200 group relative">
                        <div className="flex items-start justify-between">
                            {isEditing ? (
                                <div className="flex flex-col w-full gap-3">
                                    {/* Task title input */}
                                    <input
                                        type="text"
                                        value={task}
                                        onChange={(e) => setTask(e.target.value)}
                                        className="w-full border rounded px-2 py-1 text-sm border-none focus:outline-none "
                                        placeholder="Task title"
                                    />

                                    {/* Selected badges (only for date, priority, reminder) */}
                                    <div className="flex flex-wrap gap-2">
                                        {dateTime && (
                                            <span style={{ backgroundColor: "var(--sidebar-bg)", color: "var(--icon-color)", border: "var(--icon-color) 1px solid" }} className="flex items-center gap-1  px-2 py-1 rounded text-xs font-medium">
                                                <Calendar size={14} />
                                                {formatDateTime(dateTime)}
                                                <X size={12} className="cursor-pointer ml-1" onClick={() => setDateTime(null)} />
                                            </span>
                                        )}
                                        {priority && (
                                            <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${priority.color}`}>
                                                <Flag size={14} />
                                                {priority.label}
                                                <X size={12} className="cursor-pointer ml-1" onClick={() => setPriority(null)} />
                                            </span>
                                        )}
                                        {reminder && (
                                            <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                                <Bell size={14} />
                                                Reminder
                                                <X size={12} className="cursor-pointer ml-1" onClick={() => setReminder(false)} />
                                            </span>
                                        )}
                                    </div>

                                    {/* Add inputs */}
                                    <div className="flex flex-wrap gap-2">
                                        {/* Date/time picker */}
                                        <input
                                            type="datetime-local"
                                            value={dateTime ? dateTime.slice(0, 16) : ""}
                                            onChange={(e) => setDateTime(e.target.value)}
                                            className="text-xs border border-gray-200 text-gray-500 rounded px-2 py-1"
                                        />

                                        {/* Priority select */}
                                        <select
                                            value={priority?.value || ""}
                                            onChange={(e) => {
                                                const selected = priorityOptions.find((p) => p.value === e.target.value);
                                                setPriority(selected);
                                            }}
                                            className="text-xs border  border-gray-200 rounded px-2 py-1 text-gray-500"
                                        >
                                            <option value="">Select Priority</option>
                                            {priorityOptions.filter((p) => p.value !== priority?.value).map((p) => (
                                                <option key={p.value} value={p.value}>{p.label}</option>
                                            ))}
                                        </select>

                                        {/* Group select (no badge in editing) */}
                                        <select
                                            value={group?.value || ""}
                                            onChange={(e) => {
                                                const selected = groupOptions.find((g) => g.value === e.target.value);
                                                setGroup(selected);
                                            }}
                                            className="text-xs border border-gray-200 text-gray-500 rounded px-2 py-1"
                                        >
                                            <option value="">Select Group</option>
                                            {groupOptions.map((g) => (
                                                <option key={g.value} value={g.value}>{g.label}</option>
                                            ))}
                                        </select>

                                        {/* Reminder toggle */}
                                        <button
                                            onClick={() => setReminder(!reminder)}
                                            className="flex items-center gap-1 text-xs px-2 py-1 text-gray-500 border-gray-200  border rounded hover:bg-gray-50"
                                        >
                                            <AlarmClock size={14} /> {reminder ? "Remove Reminder" : "Add Reminder"}
                                        </button>
                                    </div>

                                  <div className="flex justify-end gap-2 text-sm">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-3 py-1 rounded bg-gray-100 text-gray-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-3 py-1 rounded text-white"
                                            style={{ backgroundColor: "var(--icon-color)" }}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm break-words pr-6">{task}</p>
                                    <TaskActions
                                        onEdit={() => setIsEditing(true)}
                                        onReminder={() => setReminder(true)}
                                        onDelete={() => console.log("Delete task")}
                                    />
                                </>
                            )}
                        </div>

                        {/* Bottom meta info (non-editing) */}
                        {!isEditing && (
                            <div className="flex flex-row justify-between items-center text-xs mt-2">
                                <div className="flex items-center gap-3 text-gray-600">
                                    {dateTime && <span>📅 {formatDateTime(dateTime)}</span>}
                                    {priority && <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${priority.color}`}>{priority.label}</span>}
                                    {reminder && <span>⏰ Reminder</span>}
                                </div>

                                {/* Show group on right side */}
                                <h4>
                                    {group ? group.label : "Home"} <span className="text-gray-500">#</span>
                                </h4>
                            </div>
                        )}
                    </div>
                </div>
                {/* TASK LIST SECTION */}
                <div className="mt-4">
                    <h3 className="text-sm font-bold border-b border-gray-200 pb-2">
                        22 Aug 2025 • Friday
                    </h3>

                    <div className="flex flex-col w-full gap-2 p-3 border-b border-gray-200 group relative">
                        <div className="flex items-start justify-between">
                            {isEditing ? (
                                <div className="flex flex-col w-full gap-3">
                                    {/* Task title input */}
                                    <input
                                        type="text"
                                        value={task}
                                        onChange={(e) => setTask(e.target.value)}
                                        className="w-full border rounded px-2 py-1 text-sm border-none focus:outline-none "
                                        placeholder="Task title"
                                    />

                                    {/* Selected badges (only for date, priority, reminder) */}
                                    <div className="flex flex-wrap gap-2">
                                        {dateTime && (
                                            <span style={{ backgroundColor: "var(--sidebar-bg)", color: "var(--icon-color)", border: "var(--icon-color) 1px solid" }} className="flex items-center gap-1  px-2 py-1 rounded text-xs font-medium">
                                                <Calendar size={14} />
                                                {formatDateTime(dateTime)}
                                                <X size={12} className="cursor-pointer ml-1" onClick={() => setDateTime(null)} />
                                            </span>
                                        )}
                                        {priority && (
                                            <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${priority.color}`}>
                                                <Flag size={14} />
                                                {priority.label}
                                                <X size={12} className="cursor-pointer ml-1" onClick={() => setPriority(null)} />
                                            </span>
                                        )}
                                        {reminder && (
                                            <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                                <Bell size={14} />
                                                Reminder
                                                <X size={12} className="cursor-pointer ml-1" onClick={() => setReminder(false)} />
                                            </span>
                                        )}
                                    </div>

                                    {/* Add inputs */}
                                    <div className="flex flex-wrap gap-2">
                                        {/* Date/time picker */}
                                        <input
                                            type="datetime-local"
                                            value={dateTime ? dateTime.slice(0, 16) : ""}
                                            onChange={(e) => setDateTime(e.target.value)}
                                            className="text-xs border border-gray-200 text-gray-500 rounded px-2 py-1"
                                        />

                                        {/* Priority select */}
                                        <select
                                            value={priority?.value || ""}
                                            onChange={(e) => {
                                                const selected = priorityOptions.find((p) => p.value === e.target.value);
                                                setPriority(selected);
                                            }}
                                            className="text-xs border  border-gray-200 rounded px-2 py-1 text-gray-500"
                                        >
                                            <option value="">Select Priority</option>
                                            {priorityOptions.filter((p) => p.value !== priority?.value).map((p) => (
                                                <option key={p.value} value={p.value}>{p.label}</option>
                                            ))}
                                        </select>

                                        {/* Group select (no badge in editing) */}
                                        <select
                                            value={group?.value || ""}
                                            onChange={(e) => {
                                                const selected = groupOptions.find((g) => g.value === e.target.value);
                                                setGroup(selected);
                                            }}
                                            className="text-xs border border-gray-200 text-gray-500 rounded px-2 py-1"
                                        >
                                            <option value="">Select Group</option>
                                            {groupOptions.map((g) => (
                                                <option key={g.value} value={g.value}>{g.label}</option>
                                            ))}
                                        </select>

                                        {/* Reminder toggle */}
                                        <button
                                            onClick={() => setReminder(!reminder)}
                                            className="flex items-center gap-1 text-xs px-2 py-1 text-gray-500 border-gray-200  border rounded hover:bg-gray-50"
                                        >
                                            <AlarmClock size={14} /> {reminder ? "Remove Reminder" : "Add Reminder"}
                                        </button>
                                    </div>

                                    {/* Save / Cancel */}
                                    <div className="flex justify-end gap-2 text-sm">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-3 py-1 rounded bg-gray-100 text-gray-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-3 py-1 rounded text-white"
                                            style={{ backgroundColor: "var(--icon-color)" }}
                                        >
                                            Save
                                        </button>
                                    </div>

                                </div>
                            ) : (
                                <>
                                    <p className="text-sm break-words pr-6">{task}</p>
                                    <TaskActions
                                        onEdit={() => setIsEditing(true)}
                                        onReminder={() => setReminder(true)}
                                        onDelete={() => console.log("Delete task")}
                                    />
                                </>
                            )}
                        </div>

                        {/* Bottom meta info (non-editing) */}
                        {!isEditing && (
                            <div className="flex flex-row justify-between items-center text-xs mt-2">
                                <div className="flex items-center gap-3 text-gray-600">
                                    {dateTime && <span>📅 {formatDateTime(dateTime)}</span>}
                                    {priority && <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${priority.color}`}>{priority.label}</span>}
                                    {reminder && <span>⏰ Reminder</span>}
                                </div>

                                {/* Show group on right side */}
                                <h4>
                                    {group ? group.label : "Home"} <span className="text-gray-500">#</span>
                                </h4>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodayTask;
