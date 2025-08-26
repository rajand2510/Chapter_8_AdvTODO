import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const colorOptions = [
  { name: "Blue", value: "#4A5FC1" },
  { name: "Red", value: "#E02424" },
  { name: "Green", value: "#18990B" },
  { name: "Yellow", value: "#E0B524" },
  { name: "Purple", value: "#6B21A8" },
];

// Example parent projects (you can fetch dynamically)
const parentProjects = [
  { label: "Main Project 1", value: "project1" },
  { label: "Main Project 2", value: "project2" },
  { label: "Main Project 3", value: "project3" },
];

export const AddSubGroupModal = ({ isOpen, onClose, onSave, project }) => {
  const [projectName, setProjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);

  const [selectedParent, setSelectedParent] = useState(null);
  const [parentDropdownOpen, setParentDropdownOpen] = useState(false);

  // Pre-fill fields if editing
  useEffect(() => {
    if (project) {
      setProjectName(project.name || "");
      setSelectedColor(project.color || colorOptions[0]);
      setSelectedParent(project.parent || null);
    }
  }, [project]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-30"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-md w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-1">
          {project ? "Edit Project" : "Add Project"}
        </h3>

        {/* Project Name */}
        <label className="block mb-2 text-sm font-medium ">Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          className="w-full text-sm mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Color Picker */}
        <label className="block mb-2 text-sm font-medium ">Color</label>
        <div className="relative mb-4">
          <button
            type="button"
            className="w-full text-sm py-2 px-3 border border-gray-300 rounded flex items-center gap-2"
            onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
          >
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: selectedColor.value }}
            ></span>
            <span className="flex-1 text-left text-xs">{selectedColor.name}</span>
            <ChevronDownIcon />
          </button>
          {colorDropdownOpen && (
            <div className="absolute mt-1 w-full bg-white border text-sm border-gray-200 rounded shadow-lg z-50">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedColor(option);
                    setColorDropdownOpen(false);
                  }}
                  className="w-full px-2 py-2 text-left text-xs flex items-center gap-2 hover:bg-gray-50 "
                >
                  <span
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: option.value }}
                  ></span>
                  {option.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Parent Project Selector */}
        <label className="block mb-2 text-sm font-medium ">Parent Project</label>
        <div className="relative mb-4">
          <button
            type="button"
            className="w-full py-2 px-3 border border-gray-300 rounded flex items-center gap-2 text-xs"
            onClick={() => setParentDropdownOpen(!parentDropdownOpen)}
          >
            <span className="flex-1 text-left">
              {selectedParent ? selectedParent.label : "Select a parent project"}
            </span>
            <ChevronDownIcon />
          </button>
          {parentDropdownOpen && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-50 text-xs">
              {parentProjects.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedParent(option);
                    setParentDropdownOpen(false);
                  }}
                  className="w-full px-2 py-2 text-left flex items-center gap-2 hover:bg-gray-50 text-gray-700"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1 text-sm rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({
                name: projectName,
                color: selectedColor,
                parent: selectedParent,
              });
              setProjectName("");
              setSelectedColor(colorOptions[0]);
              setSelectedParent(null);
              onClose();
            }}
            disabled={!projectName.trim() || !selectedParent}
            className={`px-4 py-1 text-sm rounded text-white ${
              projectName.trim() && selectedParent
                ? "cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            style={
              projectName.trim() && selectedParent
                ? { backgroundColor: "var(--icon-color)" }
                : {}
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

const ChevronDownIcon = () => (
  <svg
    className="w-4 h-4 ml-auto"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
