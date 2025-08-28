import {
    Circle,
    ListFilter,
    Plus,
    Check,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { TaskActions } from "./TaskActions";
import EditableTask from "./EditableTask";
import AddTaskModal from "./AddTaskModal";
import { useDispatch, useSelector } from "react-redux";
import { selectUpcomingTasks } from "../features/todoSlice";
import { removeTaskOptimistic } from "../features/todoSlice";
import { showUndoToast } from "../utils/showUndoToast";
const UpcomingTask = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);

    const upcomingTask = useSelector(selectUpcomingTasks);
    const dispatch = useDispatch();
    const token = useSelector(state => state.todo.token);

// In your component, when marking complete:
const handleComplete = (task) => {
  const taskWithIds = { ...task, groupId: task.groupId, subGroupId: task.subGroupId };
  dispatch(removeTaskOptimistic({ taskId: task._id, taskData: taskWithIds }));
  showUndoToast(taskWithIds, dispatch, token);
};



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

    // Format date like "22 Aug 2025 • Friday"
    const formatDateHeader = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            weekday: "long",
        });
    };

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

    // Group tasks by date
    const groupedTasks = upcomingTask.reduce((acc, task) => {
        const dateKey = new Date(task.date).toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(task);
        return acc;
    }, {});

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
                    {Object.keys(groupedTasks).map((dateKey) => (
                        <div key={dateKey} className="mb-6">
                            {/* Date Header */}
                            <h3 className="text-sm font-bold border-b border-gray-200 pb-2">
                                {formatDateHeader(dateKey)}
                            </h3>

                            {groupedTasks[dateKey].map((task) => {
                                const isEditing = editingTaskId === task._id;


                                return (
                                    <div
                                        key={task._id}
                                        className="flex flex-col w-full gap-2 p-3 border-b border-gray-200 group relative"
                                    >
                                        <div className="flex items-start justify-between">
                                            {isEditing ? (
                                                <EditableTask
                                                 taskId={task._id}
                                                    task={task.text}
                                                    setTask={() => { }}
                                                    dateTime={task.date}
                                                    setDateTime={() => { }}
                                                    priority={priorityOptions.find(p => p.value === task.priority)}
                                                    setPriority={() => { }}
                                                    reminder={task.reminder}
                                                    setReminder={() => { }}
                                                    group={{ _id: task.subGroupId, name: task.subGroupName }}
                                                    setGroup={() => { }}
                                                    priorityOptions={priorityOptions}
                                                    groupOptions={groupOptions}
                                                    isEditing={isEditing}
                                                    setIsEditing={() => setEditingTaskId(null)}
                                                />
                                            ) : (
                                                <>
                                                    {/* Left side: circle + task text */}
                                                    <div className="flex items-center gap-2 flex-1">
                                                        {/* Task complete circle */}
                                                        <button
                                                            onClick={() => handleComplete(task)}
                                                            className={`
                                                                w-5 h-5 rounded-full border 
                                                                flex items-center justify-center 
                                                                transition-all duration-200 
                                                                border-[var(--icon-color)] 
                                                                bg-[var(--tab-active)]
                                                             
                                                            `}
                                                        >
                                                            <Check
                                                                className={`
                                                                    w-3 h-3 transition-opacity duration-200 
                                                                    text-[var(--icon-color)]
                                                                   
                                                                `}
                                                            />
                                                        </button>

                                                        {/* Task text */}
                                                        <p
                                                            className={`text-sm break-words pr-6 `}
                                                        >
                                                            {task.text}
                                                        </p>
                                                    </div>

                                                    {/* Right side actions */}
                                                    <TaskActions
                                                        onEdit={() => setEditingTaskId(task._id)}
                                                        onReminder={() => console.log("Reminder set")}
                                                        onDelete={() => console.log("Delete task")}
                                                    />
                                                </>
                                            )}
                                        </div>

                                        {/* Bottom meta info (non-editing) */}
                                        {!isEditing && (
                                            <div className="flex flex-row justify-between items-center text-xs mt-2">
                                                <div className="flex items-center gap-3 text-gray-600">
                                                    {task.date && <span>📅 {formatDateTime(task.date)}</span>}
                                                    {task.priority && (
                                                        <span
                                                            className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${priorityOptions.find(p => p.value === task.priority)?.color
                                                                }`}
                                                        >
                                                            {task.priority}
                                                        </span>
                                                    )}
                                                    {task.reminder && <span>⏰ Reminder</span>}
                                                </div>

                                                {/* Show group on right side */}
                                                <h4>
                                                    {task.group || ""} <span className="text-gray-500">#</span>
                                                </h4>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
        </div>
    );
};

export default UpcomingTask;
