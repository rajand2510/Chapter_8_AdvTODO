import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTasksWithDate, removeTaskOptimistic, updateTask } from "../features/todoSlice";

const MAX_BLOCK_TASKS = 1;

export const Calendar = () => {
  const allTasks = useSelector(selectTasksWithDate);
  const dispatch = useDispatch();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [dragHoverTimer, setDragHoverTimer] = useState(null);

  const [hoverState, setHoverState] = useState({
    tasks: [],
    position: { x: 0, y: 0 },
    show: false,
    dateString: null
  });

  // Memoize grouped tasks to avoid recalculation on every render
  const tasksByDate = useMemo(() => {
    return allTasks.reduce((acc, task) => {
      const key = new Date(task.date).toDateString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {});
  }, [allTasks]);

  // Memoize calendar calculations
  const calendarInfo = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return {
      daysInMonth: endOfMonth.getDate(),
      firstDayWeek: startOfMonth.getDay()
    };
  }, [currentDate]);

  // Optimized navigation handlers
  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
    setHoverState(prev => ({ ...prev, show: false }));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
    setHoverState(prev => ({ ...prev, show: false }));
  }, []);

  // Optimized task completion handler
  
  // Function to update task date while preserving time
  const updateTaskDate = async (taskId, newDateString, originalTask) => {
    try {
      const token = localStorage.getItem("token");
      
      // Parse the original date to preserve time
      const originalDate = new Date(originalTask.date);
      const newDate = new Date(newDateString);
      
      // Set the new date but keep the original time
      newDate.setHours(originalDate.getHours());
      newDate.setMinutes(originalDate.getMinutes());
      newDate.setSeconds(originalDate.getSeconds());
      newDate.setMilliseconds(originalDate.getMilliseconds());
      
      const updatedDateTime = newDate.toISOString();
      
      const payload = {
        ...originalTask,
        date: updatedDateTime
      };
      
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (response.ok) {
        // Dispatch the updated task to Redux store
        dispatch(updateTask(result));
        console.log("Task date updated successfully:", result);
      } else {
        throw new Error(result.message || "Failed to update task date");
      }
    } catch (error) {
      console.error("Error updating task date:", error);
      alert("Failed to update task date: " + error.message);
    }
  };

  // Optimized drag handlers
  const handleDragStart = useCallback((e, task, fromDate) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ task, fromDate }));
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDrop = useCallback(async (e, toDate) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      const { task, fromDate } = data;

      if (fromDate === toDate) return;

      // Update task date via API
      await updateTaskDate(task._id, toDate, task);
      
      // Hide hover state
      setHoverState(prev => ({ ...prev, show: false }));
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  }, [dispatch]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  // Optimized hover handlers
  const handleMouseEnter = useCallback((e, dateString, dayTasks) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverState({
      tasks: dayTasks,
      position: {
        x: rect.right + 10,
        y: rect.top
      },
      show: dayTasks.length > 0,
      dateString
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverState(prev => ({ ...prev, show: false }));
  }, []);

  // Check if date is today
  const isToday = useCallback((date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, []);

  // Render calendar cells
  const renderCalendar = useMemo(() => {
    const cells = [];
    const { daysInMonth, firstDayWeek } = calendarInfo;

    // Empty cells for days before month starts
    for (let i = 0; i < firstDayWeek; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = dateObj.toDateString();
      const dayTasks = tasksByDate[dateString] || [];
      const visibleTasks = dayTasks.slice(0, MAX_BLOCK_TASKS);
      const hasMoreTasks = dayTasks.length > MAX_BLOCK_TASKS;

      cells.push(
        <div
          key={dateString}
          className="flex flex-col p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150 min-h-[80px]"
          onMouseEnter={(e) => handleMouseEnter(e, dateString, dayTasks)}
          onMouseLeave={handleMouseLeave}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, dateString)}
        >
          <span
            className={`font-semibold mb-1 text-sm ${isToday(dateObj)
              ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              : "text-gray-700"
              }`}
            style={{
              backgroundColor: isToday(dateObj) ? "var(--icon-color)" : "transparent",
              color: isToday(dateObj) ? "white" : "var(--icon-color)",
            }}
          >
            {day}
          </span>

          <div className="flex-1 space-y-1">
            {visibleTasks.map((task) => (
              <div
                key={task._id}
                className={`text-xs p-1 rounded truncate cursor-move ${task.completed
                  ? "bg-green-100 line-through text-green-600"
                  : "bg-blue-100 text-blue-700"
                  }`}
                style={{
                  backgroundColor: "var(--sidebar-bg)",
                  color: "var(--icon-color)",
                  textDecoration: "none",
                }}
                title={task.text}
                draggable
                onDragStart={(e) => handleDragStart(e, task, dateString)}
              >
                {task.text}
              </div>
            ))}

            {hasMoreTasks && (
              <div className="text-xs text-gray-500 font-medium">
                +{dayTasks.length - MAX_BLOCK_TASKS} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return cells;
  }, [calendarInfo, currentDate, tasksByDate, isToday, handleMouseEnter, handleMouseLeave, handleDrop, handleDragStart, handleDragOver]);

  return (
    <div className="p-4 w-full mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {/* Previous Month */}
<button
  onClick={handlePrevMonth}
  onDragEnter={() => {
    if (dragHoverTimer) clearTimeout(dragHoverTimer);
    const timer = setTimeout(() => {
      handlePrevMonth();
    }, 700); // wait 700ms before switching
    setDragHoverTimer(timer);
  }}
  onDragLeave={() => {
    if (dragHoverTimer) clearTimeout(dragHoverTimer);
  }}
  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
  aria-label="Previous month"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
</button>

{/* Current Month */}
<h2 className="text-2xl font-bold text-gray-800">
  {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
</h2>

{/* Next Month */}
<button
  onClick={handleNextMonth}
  onDragEnter={() => {
    if (dragHoverTimer) clearTimeout(dragHoverTimer);
    const timer = setTimeout(() => {
      handleNextMonth();
    }, 700); // wait 700ms before switching
    setDragHoverTimer(timer);
  }}
  onDragLeave={() => {
    if (dragHoverTimer) clearTimeout(dragHoverTimer);
  }}
  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
  aria-label="Next month"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
</button>

      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div style={{ color: day === "Sun" ? "var(--icon-color)" : "black" }} key={day} className="text-center font-semibold  py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {renderCalendar}
      </div>

      {/* Hover tooltip */}
      {hoverState.show && hoverState.tasks.length > 0 && (
        <div
          className="fixed bg-white border border-gray-200 shadow-xl rounded-lg p-3 z-50 max-w-sm"
          style={{
            left: Math.min(hoverState.position.x, window.innerWidth - 300),
            top: hoverState.position.y
          }}
          onMouseEnter={() => setHoverState(prev => ({ ...prev, show: true }))}
          onMouseLeave={handleMouseLeave}
        >
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">
            Tasks for {hoverState.dateString}
          </h4>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {hoverState.tasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded group"
                draggable
                onDragStart={(e) => handleDragStart(e, task, hoverState.dateString)}
              >
               
                <span
                  className={`text-sm flex-1 ${task.completed ? "line-through text-gray-400" : "text-gray-700"
                    }`}
                >
                  {task.text}
                </span>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400">
                  Drag to move
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;