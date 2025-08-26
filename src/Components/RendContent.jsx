// Components/RendContent.jsx
import React from "react";
import { useSelector } from "react-redux";
import TodayTask from "./TodayTask";
import UpcomingTask from "./UpcomingTask";
import Completed from "./Completed";
import GroupPage from "./GroupPage";
import ProjectPage from "./ProjectPage";

const RendContent = () => {
  const activeTab = useSelector((state) => state.todo.activeTab);
  const activeGroup = useSelector((state) => state.todo.activeGroup);
  const activeSubGroup = useSelector((state) => state.todo.activeSubGroup);

  // If a sub-group is selected, show SubGroup page
  if (activeSubGroup) {
    return <ProjectPage subGroup={activeSubGroup} />;
  }

  // If a group is selected, show Group page
  if (activeGroup) {
    return <GroupPage group={activeGroup} />;
  }

  // Render by tab
  switch (activeTab) {
    case "today":
      return <TodayTask />;
    case "upcoming":
      return <UpcomingTask />;
    case "completed":
      return <Completed />;
    default:
      return <TodayTask />;
  }
};

export default RendContent;
