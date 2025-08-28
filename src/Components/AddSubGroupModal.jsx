import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectGroupIdsAndNames, createSubGroup, updateSubGroup } from "../features/todoSlice";

const colorOptions = [
  { name: "Blue", nameValue: "blue", value: "#4A5FC1" },
  { name: "Red", nameValue: "red", value: "#E02424" },
  { name: "Green", nameValue: "green", value: "#18990B" },
  { name: "Yellow", nameValue: "yellow", value: "#E0B524" },
];

export const AddSubGroupModal = ({ isOpen, onClose, project, groupId }) => {
  const dispatch = useDispatch();
  const parentProjects = useSelector(selectGroupIdsAndNames);

  const [projectName, setProjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);

  const [selectedParent, setSelectedParent] = useState(null);
  const [parentDropdownOpen, setParentDropdownOpen] = useState(false);

  // Prefill if editing
  useEffect(() => {
    if (project) {
      setProjectName(project.name || "");
      const foundColor = colorOptions.find(c => c.nameValue === project.color);
      setSelectedColor(foundColor || colorOptions[0]);

      const parent = parentProjects.find(g => g.id === groupId);
      setSelectedParent(parent || null);

    } else {
      // Reset fields for add
      setProjectName("");
      setSelectedColor(colorOptions[0]);
      setSelectedParent(null);
    }
  }, [project, parentProjects]);

  if (!isOpen) return null;



  const handleSave = () => {
    if (!projectName.trim() || !selectedParent) return;

    const payload = {
      name: projectName,
      color: selectedColor.nameValue,
      groupId: selectedParent.id,
    };
    console.log(project);

    if (project) {
      // Update existing sub-group
      dispatch(updateSubGroup({  id: project._id || project.id, ...payload }));
    } else {
      // Create new sub-group
      dispatch(createSubGroup(payload));
    }

    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white p-6 rounded shadow-md w-96" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4 border-b border-gray-200 pb-1">
          {project ? "Edit Sub-Group" : "Add Sub-Group"}
        </h3>

        {/* Sub-Group Name */}
        <label className="block mb-2 text-sm font-medium">Sub-Group Name</label>
        <input
          type="text"
          value={projectName}
          onChange={e => setProjectName(e.target.value)}
          placeholder="Enter sub-group name"
          className="w-full text-sm mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Color Picker */}
        <label className="block mb-2 text-sm font-medium">Color</label>
        <div className="relative mb-4">
          <button
            type="button"
            className="w-full text-sm py-2 px-3 border border-gray-300 rounded flex items-center gap-2"
            onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
          >
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedColor.value }}></span>
            <span className="flex-1 text-left text-xs">{selectedColor.name}</span>
            <ChevronDownIcon />
          </button>
          {colorDropdownOpen && (
            <div className="absolute mt-1 w-full bg-white border text-sm border-gray-200 rounded shadow-lg z-50">
              {colorOptions.map(option => (
                <button
                  key={option.nameValue}
                  onClick={() => { setSelectedColor(option); setColorDropdownOpen(false); }}
                  className="w-full px-2 py-2 text-left text-xs flex items-center gap-2 hover:bg-gray-50"
                >
                  <span className="w-5 h-5 rounded-full" style={{ backgroundColor: option.value }}></span>
                  {option.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Parent Project Selector */}
        <label className="block mb-2 text-sm font-medium">Parent Project</label>
        <div className="relative mb-4">
          <button
            type="button"
            className="w-full py-2 px-3 border border-gray-300 rounded flex items-center gap-2 text-xs"
            onClick={() => setParentDropdownOpen(!parentDropdownOpen)}
          >
            <span className="flex-1 text-left">{selectedParent ? selectedParent.name : "Select a parent project"}</span>
            <ChevronDownIcon />
          </button>
          {parentDropdownOpen && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-50 text-xs">
              {parentProjects.map(option => (
                <button
                  key={option.id}
                  onClick={() => { setSelectedParent(option); setParentDropdownOpen(false); }}
                  className="w-full px-2 py-2 text-left flex items-center gap-2 hover:bg-gray-50 text-gray-700"
                >
                  {option.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1 text-sm rounded bg-gray-200 text-gray-600 hover:bg-gray-300">Cancel</button>
          <button
            onClick={handleSave}
            disabled={!projectName.trim() || !selectedParent}
            className={`px-4 py-1 text-sm rounded text-white ${projectName.trim() && selectedParent ? "cursor-pointer bg-blue-500" : "bg-gray-300 cursor-not-allowed"}`}
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
  <svg className="w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
