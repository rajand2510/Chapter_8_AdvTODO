import React, { useState } from "react";
import Select from "react-select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/DropdownMenu";
import {
  MoreHorizontal,
  Calendar,
  Clock,
  Bell,
  Edit,
  Trash2,
  Flag,
} from "lucide-react";

const priorityOptions = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-700" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  { value: "high", label: "High", color: "bg-red-100 text-red-700" },
];

const customStyles = {
  control: (base) => ({
    ...base,
    background: "transparent",
    border: "none",
    boxShadow: "none",
    cursor: "pointer",
    minHeight: "32px",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "2px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 6px",
  }),
};

export function TaskActions({ onEdit, onDelete, onReminder, onChange }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [priority, setPriority] = useState(null);
  const [open, setOpen] = useState(false);

  const handleChange = (field, value) => {
    if (field === "date") setSelectedDate(value);
    if (field === "time") setSelectedTime(value);
    if (field === "priority") setPriority(value);

    // Call API from parent
    onChange?.({
      date: field === "date" ? value : selectedDate,
      time: field === "time" ? value : selectedTime,
      priority: field === "priority" ? value : priority,
    });

    // Close dropdown after change
    setOpen(false);
  };

  const formatOptionLabel = ({ label, color }) => (
    <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
      {label}
    </span>
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-gray-100">
          <MoreHorizontal size={18} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 space-y-1">
        {/* Edit */}
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>

        {/* Date Picker */}
        <DropdownMenuLabel className="flex items-center gap-2 px-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleChange("date", e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm cursor-pointer"
          />
        </DropdownMenuLabel>

        {/* Time Picker */}
        <DropdownMenuLabel className="flex items-center gap-2 px-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => handleChange("time", e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm cursor-pointer"
          />
        </DropdownMenuLabel>

        {/* Priority Picker */}
        <DropdownMenuLabel className="flex items-center gap-2 px-2">
          <Flag className="h-4 w-4 text-gray-500" />
          <Select
            options={priorityOptions}
            value={priority}
            onChange={(val) => handleChange("priority", val)}
            styles={customStyles}
            formatOptionLabel={formatOptionLabel}
            placeholder="Select Priority"
            isSearchable={false}
          />
        </DropdownMenuLabel>

        {/* Reminder */}
        <DropdownMenuItem
          onClick={() => {
            onReminder?.();
            setOpen(false);
          }}
        >
          <Bell className="mr-2 h-4 w-4" /> Add Reminder
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Delete */}
        <DropdownMenuItem
          onClick={() => {
            onDelete?.();
            setOpen(false);
          }}
          className="text-red-500"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
