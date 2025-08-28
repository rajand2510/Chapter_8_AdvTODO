import React, { useState } from "react";
import ReactDOM from "react-dom";
import EditableTask from "./EditableTask";

const AddTaskModal = ({ onClose }) => {
  const priorityOptions = [
    { value: "high", label: "High", color: "bg-red-100 text-red-700" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700" },
    { value: "low", label: "Low", color: "bg-green-100 text-green-700" },
  ];

 

 

  // Modal content to be portaled
  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="relative max-w-4xl flex justify-between items-center w-full bg-white rounded-lg shadow-lg overflow-visible">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <EditableTask
          priorityOptions={priorityOptions}
          setIsEditing={onClose}
          className=""
        />

      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default AddTaskModal;
