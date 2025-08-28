import { Circle, ListFilter, Plus, Check, ChevronDown, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { TaskActions } from "./TaskActions";
import EditableTask from "./EditableTask";
import AddTaskModal from "./AddTaskModal";
import { useDispatch, useSelector } from "react-redux";
import { removeTaskOptimistic, selectTasksOfActiveSubGroup } from "../features/todoSlice";
import { showUndoToast } from "../utils/showUndoToast";

const priorityOptions = [
  { value: "high", label: "High", color: "bg-red-100 text-red-700" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  { value: "low", label: "Low", color: "bg-green-100 text-green-700" },
];

const ProjectPage = () => {
  const [editingTaskId, setEditingTaskId] = useState(null); // Track which task is being edited
  const [showAddModal, setShowAddModal] = useState(false);
 const dispatch = useDispatch();
  const token = useSelector((state) => state.todo.token);

  // In your component, when marking complete:
  const handleComplete = (task) => {
    const taskWithIds = { ...task, groupId: task.groupId, subGroupId: task.subGroupId };
    dispatch(removeTaskOptimistic({ taskId: task._id, taskData: taskWithIds }));
    showUndoToast(taskWithIds, dispatch, token);
  };

  const [completedTasks, setCompletedTasks] = useState({}); // Track completed tasks individually

  const { normalTasks, overdueTasks, noDateTasks, subGroup } = useSelector(
    selectTasksOfActiveSubGroup
  );
  console.log(subGroup);
 

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

  // Group tasks by date string
  const groupTasksByDate = (tasks) =>
    tasks.reduce((acc, task) => {
      const dateKey = task.date ? new Date(task.date).toDateString() : "No Date";
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(task);
      return acc;
    }, {});

  const normalGrouped = groupTasksByDate(normalTasks);
  const overdueGrouped = groupTasksByDate(overdueTasks);

  

  const renderTask = (task) => {
    const isEditing = editingTaskId === task._id;
    const isCompleted = completedTasks[task._id] || false;

    return (
      <div
        key={task._id}
        className="flex flex-col w-full gap-2 p-3 group relative hover:bg-gray-50 rounded-lg"
      >
        <div className="flex items-start justify-between">
          {isEditing ? (
            <EditableTask
             taskId={task._id}
              task={task.text}
              setTask={() => {}}
              dateTime={task.date}
              setDateTime={() => {}}
              priority={priorityOptions.find((p) => p.value === task.priority)}
              setPriority={() => {}}
              reminder={task.reminder}
              setReminder={() => {}}
              group={subGroup ? { _id: subGroup.id || subGroup._id, name: subGroup.name } : null}

              setGroup={() => {}}
              priorityOptions={priorityOptions}
              groupOptions={[]}
              isEditing={isEditing}
              setIsEditing={() => setEditingTaskId(null)}
            />
          ) : (
            <>
              <div className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => handleComplete(task)}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 border-[var(--icon-color)] bg-[var(--tab-active)] ${
                    isCompleted ? "scale-90" : "scale-100"
                  }`}
                >
                  <Check
                    className={`w-3 h-3 transition-opacity duration-200 text-[var(--icon-color)] ${
                      isCompleted ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </button>
                <p
                  className={`text-sm break-words pr-6 ${isCompleted ? "line-through text-gray-400" : ""}`}
                >
                  {task.text}
                </p>
              </div>

              <TaskActions
                onEdit={() => setEditingTaskId(task._id)}
                onReminder={() => console.log("Set Reminder")}
                onDelete={() => console.log("Delete task", task.text)}
              />
            </>
          )}
        </div>

        {!isEditing && (
          <div className="flex flex-row justify-between items-center text-xs mt-2">
            <div className="flex items-center gap-3 text-gray-600">
              {task.date && <span>📅 {formatDateTime(task.date)}</span>}
              {task.priority && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                    priorityOptions.find((p) => p.value === task.priority)?.color
                  }`}
                >
                  {task.priority}
                </span>
              )}
              {task.reminder && <span>⏰ Reminder</span>}
            </div>

            <h4>
              {subGroup?.name || ""} <span className="text-gray-500">#</span>
            </h4>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <header className="p-5 flex justify-end">
        <div className="relative w-6 h-6">
          <Circle className="absolute inset-0 text-gray-500" strokeWidth={1.5} />
          <ListFilter className="absolute inset-0 m-auto w-3.5 h-3.5 text-gray-700" />
        </div>
      </header>

      <div className="flex flex-col max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-3xl font-bold">{subGroup?.name}</h3>
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

        {/* OVERDUE TASKS */}
   {/* OVERDUE TASKS */}
{overdueTasks.length > 0 && (
  <div className="mt-4">
    <h3 className="text-sm font-bold border-b border-gray-200 pb-2">Overdue</h3>
    {overdueTasks.map(renderTask)}
  </div>
)}


        {/* NORMAL TASKS */}
        {Object.keys(normalGrouped).length > 0 && (
          <div className="mt-4">
            {Object.keys(normalGrouped).map((date) => (
              <div key={date}>
                <h3 className="text-sm font-bold border-b border-gray-200 pb-2">{date}</h3>
                {normalGrouped[date].map(renderTask)}
              </div>
            ))}
          </div>
        )}

        {/* NO DATE TASKS */}
        {noDateTasks.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-bold border-b border-gray-200 pb-2">No Date</h3>
            {noDateTasks.map(renderTask)}
          </div>
        )}
      </div>

      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

export default ProjectPage;
