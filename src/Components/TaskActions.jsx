import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import {
  MoreHorizontal,
  Calendar,
  Clock,
  Bell,
  Edit,
  Trash2,
  Flag,
} from "lucide-react";





export function TaskActions({ taskId, onEdit, onDelete }) {
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





  // ✅ API delete function
  const handleDelete = async () => {
    if (!taskId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete task");
      }

      onDelete?.(taskId); // callback to parent (to update UI)
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setOpen(false);
    }
  };

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
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2 text-sm z-50">
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

         
     

          {/* Divider */}
          <div className="border-t border-gray-200 my-1"></div>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="flex items-center w-full px-2 py-2 rounded text-red-500 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
