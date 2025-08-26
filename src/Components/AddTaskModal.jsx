import React, { useState } from "react";
import ReactDOM from "react-dom";
import EditableTask from "./EditableTask";

const AddTaskModal = ({ onClose }) => {
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

  const [loading, setLoading] = useState(false);

  const saveTaskToAPI = async (task) => {
    setLoading(true);
    try {
      // Replace with your real API endpoint
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error("Failed to save task");

      const data = await response.json();
      alert("Task saved successfully!");
      onClose(); // Close modal only after success
      return data;
    } catch (error) {
      console.error(error);
      alert("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          groupOptions={groupOptions}
          onSave={saveTaskToAPI}
          setIsEditing={onClose}
          className=""
        />

        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-black/30">
            <span className="text-white text-lg">Saving...</span>
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default AddTaskModal;
