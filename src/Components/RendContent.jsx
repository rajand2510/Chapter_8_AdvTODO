import React from "react";
import { useSelector } from "react-redux";
import TodayTask from "./TodayTask";
import UpcomingTask from "./UpcomingTask";
import Completed from "./Completed";
import GroupPage from "./GroupPage";
import ProjectPage from "./ProjectPage";
import Calendar from "./Calendar";

const RendContent = () => {
  const activeTab = useSelector((state) => state.todo.activeTab);
  const activeGroup = useSelector((state) => state.todo.activeGroup);
  const activeSubGroup = useSelector((state) => state.todo.activeSubGroup);

  // ✅ Priority order: SubGroup > Group > Tab
  if (activeSubGroup) {
    return <ProjectPage subGroup={activeSubGroup} />;
  }

  if (activeGroup) {
    return <GroupPage group={activeGroup} />;
  }

  if (activeTab) {
    switch (activeTab) {
      case "today":
        return <TodayTask />;
      case "upcoming":
        return <UpcomingTask />;
      case "completed":
        return <Completed />;
      case "calendar":
        return <Calendar />;
      default:
        return null;
    }
  }

  // Default fallback
  return <TodayTask />;
};

export default RendContent;
