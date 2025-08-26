import { Circle, ListFilter, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { TaskActions } from "./TaskActions";
import { AddSubGroupModal } from "./AddSubGroupModal";
import { ProjectTaskAction } from "./ProjectTaskAction";

const GroupPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [reminder, setReminder] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [priorityOpen, setPriorityOpen] = useState(false);
    const [groupOpen, setGroupOpen] = useState(false);
    const priorityRef = useRef(null);
    const groupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (priorityRef.current && !priorityRef.current.contains(e.target)) {
                setPriorityOpen(false);
            }
            if (groupRef.current && !groupRef.current.contains(e.target)) {
                setGroupOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  
    return (
        <div className="w-full">
            {/* HEADER */}
            <header className="p-5 flex justify-end">
                <div className="relative w-6 h-6">
                    <Circle className="absolute inset-0 text-gray-500" strokeWidth={1.5} />
                    <ListFilter className="absolute inset-0 m-auto w-3.5 h-3.5 text-gray-700" />
                </div>
            </header>

            <div className="flex flex-col max-w-4xl mx-auto w-full">
                <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-bold">Personal</h3>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="p-2 px-3 rounded-lg gap-2 flex hover:bg-black/5 items-center cursor-pointer"
                    >
                        <span className="w-6 h-6 flex items-center justify-center rounded-full transition">
                            <Plus size={16} style={{ color: "var(--icon-color)" }} className="text-white" />
                        </span>
                        <span
                            onClick={() => setModalOpen(true)}
                            style={{ color: "var(--icon-color)" }}
                            className="text-sm font-medium transition"
                        >
                            Add Project
                        </span>
                    </button>
                </div>

                {/* TASK LIST SECTION */}
                <div className="mt-8">
                    <h3 className="text-sm font-bold border-b border-gray-200 pb-2">4 projects</h3>
                    
                    <div className="flex flex-col w-full gap-2 p-3 py-6  group relative  hover:bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                            <>
                                {/* Left side: circle + task text */}
                                <div className="flex items-center gap-2 flex-1">
                                    {/* Project text */}
                                    <p className={` break-words pr-6 `}>
                                        {" "}
                                        <span className="text-gray-500">#</span> Home
                                    </p>
                                </div>

                                {/* Right side actions */}
                                <ProjectTaskAction
                                    onEdit={() => setModalOpen(true)}   // Open edit modal
                                    onDelete={() => console.log("Delete project")}
                                />
                            </>
                        </div>
                    </div>
                   <div className="flex flex-col w-full gap-2 p-3 py-6  group relative  hover:bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                            <>
                                {/* Left side: circle + task text */}
                                <div className="flex items-center gap-2 flex-1">
                                    {/* Project text */}
                                    <p className={` break-words pr-6 `}>
                                        {" "}
                                        <span className="text-gray-500">#</span> Home
                                    </p>
                                </div>

                                {/* Right side actions */}
                                <ProjectTaskAction
                                    onEdit={() => setModalOpen(true)}   // Open edit modal
                                    onDelete={() => console.log("Delete project")}
                                />
                            </>
                        </div>
                    </div> <div className="flex flex-col w-full gap-2 p-3 py-6  group relative  hover:bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                            <>
                                {/* Left side: circle + task text */}
                                <div className="flex items-center gap-2 flex-1">
                                    {/* Project text */}
                                    <p className={` break-words pr-6 `}>
                                        {" "}
                                        <span className="text-gray-500">#</span> Home
                                    </p>
                                </div>

                                {/* Right side actions */}
                                <ProjectTaskAction
                                    onEdit={() => setModalOpen(true)}   // Open edit modal
                                    onDelete={() => console.log("Delete project")}
                                />
                            </>
                        </div>
                    </div> <div className="flex flex-col w-full gap-2 p-3 py-5  group relative  hover:bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                            <>
                                {/* Left side: circle + task text */}
                                <div className="flex items-center gap-2 flex-1">
                                    {/* Project text */}
                                    <p className={` break-words pr-6 `}>
                                        {" "}
                                        <span className="text-gray-500">#</span> Home
                                    </p>
                                </div>

                                {/* Right side actions */}
                                <ProjectTaskAction
                                    onEdit={() => setModalOpen(true)}   // Open edit modal
                                    onDelete={() => console.log("Delete project")}
                                />
                            </>
                        </div>
                    </div>
                </div>

            </div>
            <AddSubGroupModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={(data) => console.log("Saved Project:", data)}
                project={{ name: "Home", color: "#4A5FC1", parent: null }} // or pass {name:"Home", color:...} for edit
            />
        </div>
    );
};

export default GroupPage;
