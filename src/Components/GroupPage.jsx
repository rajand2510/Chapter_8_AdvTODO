import { Circle, ListFilter, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { ProjectTaskAction } from "./ProjectTaskAction";
import { AddSubGroupModal } from "./AddSubGroupModal";
import { useDispatch, useSelector } from "react-redux";
import {
    selectActiveGroupWithSubGroups,
    deleteSubGroup,
} from "../features/todoSlice";
const getColorByName = (name) => {
    switch (name?.toLowerCase()) {
        case "red":
            return "red-600";
        case "blue":
            return "blue-600";
        case "green":
            return "green-600";
        case "yellow":
            return "yellow-600";
        default:
            return "gray-600"; // fallback color
    }
};

const GroupPage = () => {
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState(null); // track edit vs add
    const priorityRef = useRef(null);
    const groupRef = useRef(null);

    const groupData = useSelector(selectActiveGroupWithSubGroups); // active group + subgroups


    const activeGroup = useSelector((state) => state.todo.activeGroup);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (priorityRef.current && !priorityRef.current.contains(e.target)) {
                // For priority dropdown if any
            }
            if (groupRef.current && !groupRef.current.contains(e.target)) {
                // For group dropdown if any
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
                    <h3 className="text-3xl font-bold">{groupData?.name || "No Group Selected"}</h3>
                    <button
                        onClick={() => {
                            setEditingSub(null); // reset
                            setModalOpen(true);
                        }}
                        className="p-2 px-3 rounded-lg gap-2 flex hover:bg-black/5 items-center cursor-pointer"
                    >
                        <span className="w-6 h-6 flex items-center justify-center rounded-full transition">
                            <Plus size={16} style={{ color: "var(--icon-color)" }} className="text-white" />
                        </span>
                        <span style={{ color: "var(--icon-color)" }} className="text-sm font-medium transition">
                            Add Project
                        </span>
                    </button>
                </div>

                {/* TASK LIST SECTION */}
                <div className="mt-8">
                    <h3 className="text-sm font-bold border-b border-gray-200 pb-2">
                        {groupData?.subGroups?.length || 0} projects
                    </h3>

                    {groupData?.subGroups?.map((sub) => (
                        <div
                            key={sub._id}  // ✅ you have a key
                            className="flex flex-col w-full gap-2 p-3 py-6 group relative hover:bg-gray-50 rounded-lg"

                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                    <p className="break-words pr-6">
                                        <span className={`text-${getColorByName(sub.color)}`}>#</span> {sub.name}
                                    </p>
                                </div>

                                <ProjectTaskAction
                                    onEdit={() => {
                                        setEditingSub(sub);
                                        setModalOpen(true);
                                    }}
                                    onDelete={() => {
                                        console.log(sub.id, sub.name, groupData.id);
                                        dispatch(deleteSubGroup(sub.id));
                                    }}
                                />
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            <AddSubGroupModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                project={editingSub}
                groupId={groupData.id}
            />

        </div>
    );
};

export default GroupPage;
