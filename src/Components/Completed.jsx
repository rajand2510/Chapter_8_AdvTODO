import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompletedTasks } from "../features/historySlice";
import { CheckCircle, Circle, ListFilter } from "lucide-react";
import { useAuth } from "../Context/AuthContext";

const Completed = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.completedTasks);
  const status = useSelector((state) => state.tasks.status);
  const error = useSelector((state) => state.tasks.error);
  const { user } = useAuth();

  // Extract initials from user name
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCompletedTasks());
    }
  }, [status, dispatch]);

if (status==="laoding") {
  return (
    <div className="flex justify-center w-full items-center ">
      <div
        className="w-8 h-8 border-4 border-t-transparent border-solid rounded-full animate-spin"
        style={{ borderColor: "var(--icon-color) transparent transparent transparent" }}
      ></div>
    </div>
  );
}

if (status === "failed") {
  return (
    <div className="flex flex-col w-full justify-center items-center h-full text-red-600">
      <svg
        className="w-10 h-10 mb-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-lg font-semibold">Oops! Something went wrong.</p>
      <p className="text-sm">{error}</p>
    </div>
  );
}


  // Group tasks by completed date (YYYY-MM-DD)
  const groupedTasks = tasks.reduce((groups, task) => {
    const date = new Date(task.completedAt).toISOString().split("T")[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(task);
    return groups;
  }, {});

  // Sort dates descending
  const sortedDates = Object.keys(groupedTasks).sort((a, b) =>
    a < b ? 1 : -1
  );

  // Format date nicely (e.g., "22 Aug 2025 • Friday")
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", weekday: "long" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time (e.g., "01:15")
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        <h3 className="text-3xl font-bold">Activity</h3>

        {sortedDates.map((date) => (
          <div key={date} className="mt-4">
            <h3 className="text-sm font-bold border-b border-gray-200 pb-2">
              {formatDate(date)}
            </h3>

            {groupedTasks[date].map((task) => (
              <div key={task._id} className="flex flex-row py-4 gap-4 border-b border-gray-200">
                <div className="relative">
                  <div
                    className="w-12 h-12 flex items-center justify-center text-xl font-bold rounded-full shadow-sm"
                    style={{
                      backgroundColor: "var(--tab-active)",
                      color: "var(--icon-color)",
                      border: "2px solid var(--icon-color)"
                    }}
                  >
                    {initials}
                  </div>
                  <CheckCircle className="absolute bottom-0 right-0 w-4 h-4 text-green-500 bg-white rounded-full" />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <p className="text-sm">
                    <span className="font-bold">You</span> completed a task:{" "}
                    <span className="underline">{task.taskText}</span>
                  </p>
                  <div className="flex flex-row justify-between text-xs">
                    <h4>{formatTime(task.completedAt)}</h4>
                    <h4>
                      {task.subGroupName} <span className="text-gray-500">#</span>
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Completed;
