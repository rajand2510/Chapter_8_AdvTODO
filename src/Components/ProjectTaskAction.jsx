import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

export function ProjectTaskAction({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded hover:bg-gray-100"
      >
        <MoreHorizontal size={18} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-sm z-50">
          {/* Edit */}
          <button
            onClick={() => {
              onEdit?.();
              setOpen(false);
            }}
            className="flex items-center w-full px-2 py-2 rounded hover:bg-gray-50"
          >
            <Edit className="mr-2 h-4 w-4 text-gray-600" /> Edit
          </button>

          {/* Delete */}
          <button
            onClick={() => {
              onDelete?.();
              setOpen(false);
            }}
            className="flex items-center w-full px-2 py-2 rounded text-red-500 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
