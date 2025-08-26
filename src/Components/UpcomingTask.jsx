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
    ChevronDown,
    ChevronRight,
    Plus,
    Check
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { TaskActions } from "./TaskActions";
import EditableTask from "./EditableTask";
import AddTaskModal from "./AddTaskModal";

const UpcomingTask = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [task, setTask] = useState("Take kids to the park after work tom");
    const [showAddModal, setShowAddModal] = useState(false);

    // Meta states
    const [dateTime, setDateTime] = useState(null);
    const [priority, setPriority] = useState(null);
    const [reminder, setReminder] = useState(false);
    const [group, setGroup] = useState(null); // new group state
    const [isOpen, setIsOpen] = useState(true); // New state for toggle
    const [priorityOpen, setPriorityOpen] = useState(false);
    const [groupOpen, setGroupOpen] = useState(false);
    const priorityRef = useRef(null);
    const groupRef = useRef(null);
    const [isCompleted, setIsCompleted] = useState(false);
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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (priorityRef.current && !priorityRef.current.contains(e.target)) {
                setPriorityOpen(false);
            }
            if (groupRef.current && !groupRef.current.contains(e.target)) {
                setGroupOpen(false);
            }
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
                <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-bold">Upcoming</h3>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="p-2 px-3 rounded-lg gap-2 flex hover:bg-black/5 items-center cursor-pointer"
                    >
                        <span className="w-6 h-6 flex items-center justify-center rounded-full transition">
                            <Plus size={16} style={{ color: "var(--icon-color)" }} className="text-white" />
                        </span>
                        <span style={{ color: "var(--icon-color)" }} className="text-sm font-medium transition">
                            Add Task
                        </span>
                    </button>

                </div>
               

                {/* TASK LIST SECTION */}
                <div className="mt-4">
                    <h3 className="text-sm font-bold border-b border-gray-200 pb-2">22 Aug 2025 • Friday</h3>

                    <div className="flex flex-col w-full gap-2 p-3 border-b border-gray-200 group relative">
                        <div className="flex items-start justify-between">
                            {isEditing ? (
                                <EditableTask
                                    task={task}
                                    setTask={setTask}
                                    dateTime={dateTime}
                                    setDateTime={setDateTime}
                                    priority={priority}
                                    setPriority={setPriority}
                                    reminder={reminder}
                                    setReminder={setReminder}
                                    group={group}
                                    setGroup={setGroup}
                                    priorityOptions={priorityOptions}
                                    groupOptions={groupOptions}
                                    isEditing={isEditing}
                                    setIsEditing={setIsEditing}
                                />
                            ) : (
                                <>
                                    {/* Left side: circle + task text */}
                                    <div className="flex items-center gap-2 flex-1">
                                        {/* Task complete circle */}
                                        <button
                                            onClick={() => setIsCompleted(!isCompleted)}
                                            className={`
              w-5 h-5 rounded-full border 
              flex items-center justify-center 
              transition-all duration-200 
              border-[var(--icon-color)] 
              bg-[var(--tab-active)]
              ${isCompleted ? "scale-90" : "scale-100"}
            `}
                                        >
                                            <Check
                                                className={`
                w-3 h-3 transition-opacity duration-200 
                text-[var(--icon-color)]
                ${isCompleted ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
              `}
                                            />
                                        </button>

                                        {/* Task text */}
                                        <p
                                            className={`text-sm break-words pr-6 ${isCompleted ? "line-through text-gray-400" : ""
                                                }`}
                                        >
                                            {task}
                                        </p>
                                    </div>

                                    {/* Right side actions */}
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
                                    {priority && (
                                        <span
                                            className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${priority.color}`}
                                        >
                                            {priority.label}
                                        </span>
                                    )}
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
            {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
        </div>
    );
};

export default UpcomingTask;
