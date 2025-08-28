import {
  Circle,
  ListFilter,
  ChevronDown,
  ChevronRight,
  Plus,
  Check,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { TaskActions } from "./TaskActions";
import EditableTask from "./EditableTask";
import AddTaskModal from "./AddTaskModal";
import { useDispatch, useSelector } from "react-redux";
import {
  removeTaskOptimistic,
  selectOverdueTasks,
  selectTodayTasks,
} from "../features/todoSlice";
import { showUndoToast } from "../utils/showUndoToast";

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

const TodayTask = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState(null);

  // Meta states (for editable form)
  const [dateTime, setDateTime] = useState(null);
  const [priority, setPriority] = useState(null);
  const [reminder, setReminder] = useState(false);
  const [group, setGroup] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const todayTask = useSelector(selectTodayTasks);
  const overdueTasks = useSelector(selectOverdueTasks);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.todo.token);

  // In your component, when marking complete:
  const handleComplete = (task) => {
    const taskWithIds = { ...task, groupId: task.groupId, subGroupId: task.subGroupId };
    dispatch(removeTaskOptimistic({ taskId: task._id, taskData: taskWithIds }));
    showUndoToast(taskWithIds, dispatch, token);
  };

  // 🔑 helper to start editing
  const startEditingTask = (t) => {
    setTask(t);
    setDateTime(t.date || null);
    setPriority(priorityOptions.find((p) => p.value === t.priority) || null);
    setReminder(!!t.reminder);
    setGroup({ _id: t.subGroupId, name: t.subGroupName });
    setIsEditing(true);
  };

  // Format date nicely
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
          <h3 className="text-3xl font-bold">Today</h3>
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

        {/* Overdue Section */}
        <div className="mt-4 rounded">
          <div
            className="flex items-center gap-2 cursor-pointer py-2 border-b border-gray-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <h3 className="text-sm font-bold">Overdue</h3>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>

          {isOpen && (
            <div className="flex flex-col w-full">
              {overdueTasks.length > 0 ? (
                overdueTasks.map((t) => (
                  <div
                    key={t._id}
                    className="flex flex-col w-full gap-2 p-3 border-b border-gray-200 group relative"
                  >
                    <div className="flex items-start justify-between">
                      {isEditing && task?._id === t._id ? (
                        <EditableTask
                         taskId={t._id}
                          task={task.text}
                          setTask={(val) => setTask({ ...task, text: val })}
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
                          <div className="flex items-center gap-2 flex-1">
                            <button
                              onClick={() => handleComplete(t)}
                              className="w-5 h-5 rounded-full border flex items-center justify-center border-[var(--icon-color)] bg-[var(--tab-active)]"
                            >
                              <Check className="w-3 h-3 text-[var(--icon-color)] transition-opacity duration-200" />
                            </button>
                            <p className="text-sm break-words pr-6">{t.text}</p>
                          </div>
                          <TaskActions
                            onEdit={() => startEditingTask(t)}
                            onReminder={() => console.log("Reminder", t._id)}
                            onDelete={() => console.log("Delete", t._id)}
                          />
                        </>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex flex-row justify-between items-center text-xs mt-2">
                        <div className="flex items-center gap-3 text-gray-600">
                          {t.date && <span>📅 {formatDateTime(t.date)}</span>}
                          {t.priority && (
                            <span
                              className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                                t.priority === "high"
                                  ? "bg-red-100 text-red-700"
                                  : t.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {t.priority}
                            </span>
                          )}
                          {t.reminder && <span>⏰ Reminder</span>}
                        </div>
                        <h4>
                          {t.subGroupName || ""} <span className="text-gray-500">#</span>
                        </h4>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="p-3 text-gray-500">No overdue tasks ✅</p>
              )}
            </div>
          )}
        </div>

        {/* Task List Section */}
        <div className="mt-16">
          <h3 className="text-sm font-bold border-b border-gray-200 pb-2">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>

          {todayTask.length > 0 ? (
            todayTask.map((t) => (
              <div
                key={t._id}
                className="flex flex-col w-full gap-2 p-3 border-b border-gray-200 group relative"
              >
                <div className="flex items-start justify-between">
                  {isEditing && task?._id === t._id ? (
                    <EditableTask
                    taskId={t._id}
                      task={task.text}
                      setTask={(val) => setTask({ ...task, text: val })}
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
                      <div className="flex items-center gap-2 flex-1">
                        <button
                          onClick={() => handleComplete(t)}
                          className="w-5 h-5 rounded-full border flex items-center justify-center border-[var(--icon-color)] bg-[var(--tab-active)]"
                        >
                          <Check className="w-3 h-3 text-[var(--icon-color)] transition-opacity duration-200" />
                        </button>
                        <p className="text-sm break-words pr-6">{t.text}</p>
                      </div>
                      <TaskActions
                        onEdit={() => startEditingTask(t)}
                        onReminder={() => console.log("Reminder", t._id)}
                        onDelete={() => console.log("Delete", t._id)}
                      />
                    </>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex flex-row justify-between items-center text-xs mt-2">
                    <div className="flex items-center gap-3 text-gray-600">
                      {t.date && <span>📅 {formatDateTime(t.date)}</span>}
                      {t.priority && (
                        <span
                          className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                            t.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : t.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {t.priority}
                        </span>
                      )}
                      {t.reminder && <span>⏰ Reminder</span>}
                    </div>
                    <h4>
                      {t.subGroupName || ""} <span className="text-gray-500">#</span>
                    </h4>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="p-3 text-gray-500">No tasks for today 🎉</p>
          )}
        </div>
      </div>

      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

export default TodayTask;
