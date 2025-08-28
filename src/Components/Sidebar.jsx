import {
  Calendar1Icon,
  ChevronDown,
  ChevronRight,
  PanelRight,
  Plus,
  Check,
  X,
  Clock,
  CalendarDays,
  CheckCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveTab,
  setActiveGroup,
  setActiveSubGroup,
} from "../features/todoSlice";
import { AddSubGroupModal } from "./AddSubGroupModal";
import AddTaskModal from "./AddTaskModal";
import { useAuth } from "../Context/AuthContext";
import ProfileModal from "./ProfileModal";
 const getColorByName = (name) => {
    switch (name.toLowerCase()) {
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
const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const groups = useSelector((state) => state.todo.groups);
  const activeTab = useSelector((state) => state.todo.activeTab);
  const activeGroup = useSelector((state) => state.todo.activeGroup);
  const activeSubGroup = useSelector((state) => state.todo.activeSubGroup);

  const [isOpen, setIsOpen] = useState(true);

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [fullName, setFullName] = useState("Guest");
  const [profilePicture, setProfilePicture] = useState(null);
  const [openGroups, setOpenGroups] = useState({});

  const toggleGroup = (groupId) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };


  useEffect(() => {
  if (groups.length > 0) {
    const expanded = {};
    groups.forEach((g) => {
      expanded[g._id] = true; // true = opened
    });
    setOpenGroups(expanded);
  }
}, [groups]);

  useEffect(() => {
    if (user) {
      setFullName(user.name || "Guest");
      setProfilePicture(user.imageUrl || null);
    }
  }, [user]);

  const firstName = fullName.split(" ")[0];
  const nameParts = fullName.split(" ");
  const initials =
    nameParts.length > 1
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
      : nameParts[0][0].toUpperCase();

  const menuItems = [
    { id: "today", name: "Today", icon: <Calendar1Icon strokeWidth={1} size={22} /> },
    { id: "upcoming", name: "Upcoming", icon: <Clock strokeWidth={1} size={22} /> },
    { id: "calendar", name: "Calendar", icon: <CalendarDays strokeWidth={1} size={22} /> },
    { id: "completed", name: "Completed", icon: <CheckCircle strokeWidth={1} size={22} /> },
  ];

  const handleToggleSidebar = () => setIsOpen(!isOpen);

  // ✅ Only Redux state updates
  const handleTabClick = (tabId) => {
    dispatch(setActiveTab(tabId));
  };

  const handleGroupClick = (group) => {
    dispatch(setActiveGroup(group));
  };

  const handleSubGroupClick = (group, subGroup) => {
    console.log(subGroup);
    
    dispatch(setActiveGroup(group));
    dispatch(setActiveSubGroup(subGroup));
  };



  return (
    <div className="sticky top-0 left-0 h-screen">
      <div
        className={`h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? "w-[310px] opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-full"
        }`}
        style={{ backgroundColor: "var(--sidebar-bg)" }}
      >
        {isOpen && (
          <>
            {/* Header: Profile + toggle */}
            <div className="flex flex-row items-center justify-between p-4">
              <span
                onClick={() => setProfileOpen(true)}
                className="flex items-center gap-3 hover:bg-gray-400/15 p-1 rounded-lg cursor-pointer"
              >
                <div
                  className="w-7 h-7 flex items-center justify-center text-xs rounded-full"
                  style={{
                    backgroundColor: "var(--tab-active)",
                    color: "var(--icon-color)",
                    border: "1px solid var(--icon-color)",
                  }}
                >
                  {initials}
                </div>
                <h4 className="text-sm font-semibold text-gray-800">{firstName}</h4>
              </span>

              <span
                className="cursor-pointer p-1 rounded-lg hover:bg-gray-400/15 active:scale-90"
                onClick={handleToggleSidebar}
              >
                <PanelRight size={22} strokeWidth={1.5} className="text-gray-500 hover:text-gray-700" />
              </span>
            </div>

            {/* Sidebar menu */}
            <div className="px-2 flex flex-col h-full">
              <div className="flex-1 overflow-y-auto">
                {/* Add Task */}
                <div
                  onClick={() => setShowAddTaskModal(true)}
                  className="p-2 px-3 rounded-lg gap-2 flex hover:bg-black/5 items-center cursor-pointer"
                >
                  <span
                    style={{ backgroundColor: "var(--icon-color)" }}
                    className="w-6 h-6 flex items-center justify-center rounded-full transition"
                  >
                    <Plus size={16} className="text-white" />
                  </span>
                  <span style={{ color: "var(--icon-color)" }} className="text-sm font-medium transition">
                    Add Task
                  </span>
                </div>

                {/* Tabs */}
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className="p-2 px-3 rounded-lg gap-2 flex items-center cursor-pointer transition hover:bg-black/5"
                    style={{ backgroundColor: activeTab === item.id ? "var(--tab-active)" : "" }}
                  >
                    <span
                      className="w-6 h-6 flex items-center justify-center rounded-full transition"
                      style={{ color: activeTab === item.id ? "var(--icon-color)" : "#6B7280" }}
                    >
                      {item.icon}
                    </span>
                    <span
                      className="text-sm transition"
                      style={{ color: activeTab === item.id ? "var(--icon-color)" : "#111827" }}
                    >
                      {item.name}
                    </span>
                  </div>
                ))}

                {/* Groups */}
                <div className="mt-2">
                  {groups.map((group) => (
                    <div key={group._id} className="mb-2">
                      <div
                        className="p-2 px-3 rounded-lg gap-2 flex items-center justify-between hover:bg-black/5 group"
                        onClick={() => handleGroupClick(group)}
                        style={{
                          backgroundColor: activeGroup?._id === group._id ? "var(--tab-active)" : "",
                        }}
                      >
                        <span className="text-sm font-medium transition cursor-pointer">
                          {group.name}
                        </span>
                        <div className="flex gap-2">
                          {/* Add Subgroup */}
                      
                          {/* Toggle */}
                          <span
                            className="p-[2px] rounded-lg hover:bg-black/5 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleGroup(group._id);
                            }}
                          >
                            {openGroups[group._id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                          </span>
                        </div>
                      </div>

                      {/* SubGroups */}
                      {openGroups[group._id] &&
                        group.subGroups.map((sub) => (
                          <div
                            key={sub._id}
                            onClick={() => handleSubGroupClick(group, sub)}
                            className="p-2 pl-10 px-3 rounded-lg gap-2 flex items-center cursor-pointer hover:bg-black/5"
                            style={{
                              backgroundColor: activeSubGroup?._id === sub._id ? "var(--tab-active)" : "",
                            }}
                          >
                            <span className="text-sm"><span className={`text-${getColorByName(sub.color)}`}># </span>{sub.name}</span>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add new group input */}
              
            </div>
          </>
        )}
      </div>

      {!isOpen && (
        <span
          className="absolute top-4 left-4 cursor-pointer p-1 rounded-lg hover:bg-gray-100 active:scale-90"
          onClick={handleToggleSidebar}
        >
          <PanelRight size={22} strokeWidth={1.5} className="text-gray-600 hover:text-gray-800" />
        </span>
      )}


      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
      {showAddTaskModal && <AddTaskModal onClose={() => setShowAddTaskModal(false)} />}
    </div>
  );
};

export default Sidebar;
