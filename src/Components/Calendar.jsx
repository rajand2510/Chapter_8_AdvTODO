import React from "react";

const Calendar = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="p-6 w-full">
      {/* Page Header */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        📅 Calendar
      </h2>

      {/* Calendar Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-500 text-center mb-4">Coming Soon...</p>

        {/* Calendar Preview */}
        <div className="grid grid-cols-7 gap-2 text-sm">
          {days.map((day) => (
            <div
              key={day}
              className="text-gray-600 font-medium text-center"
            >
              {day}
            </div>
          ))}

          {dates.map((date) => (
            <div
              key={date}
              className="h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 bg-gray-50"
            >
              {date}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
