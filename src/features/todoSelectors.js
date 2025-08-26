// features/todoSelectors.js
const priorityOrder = { high: 1, medium: 2, low: 3 };

export const selectAllTasks = (state) => {
  const tasks = [];
  (state.todo.groups || []).forEach((group) => {
    (group.subGroups || []).forEach((sub) => {
      (sub.tasks || []).forEach((task) => {
        tasks.push({ ...task, groupName: group.name, subGroupName: sub.name });
      });
    });
  });
  return tasks;
};

// Today tasks
export const selectTasksForToday = (state) => {
  const today = new Date();
  return selectAllTasks(state).filter(task => {
    if (!task.date) return false;
    const d = new Date(task.date);
    return d.getFullYear() === today.getFullYear() &&
           d.getMonth() === today.getMonth() &&
           d.getDate() === today.getDate();
  });
};

// Overdue tasks
export const selectOverdueTasks = (state) => {
  const now = new Date();
  return selectAllTasks(state).filter(task => task.date && !task.completed && new Date(task.date) < now);
};

export const selectUpcomingTasks = (state) => {
  const today = new Date();
  let tasks = [];
  state.todo.groups.forEach((group) => {
    group.subGroups.forEach((sub) => {
      sub.tasks.forEach((task) => {
        if (task.date && new Date(task.date) > today && !task.completed) tasks.push(task);
      });
    });
  });
  return tasks.sort(
    (a, b) =>
      priorityOrder[a.priority] - priorityOrder[b.priority] || new Date(a.date) - new Date(b.date)
  );
};

export const selectSubGroupsByGroup = (state, groupId) => {
  return state.todo.groups.find((g) => g._id === groupId)?.subGroups || [];
};

export const selectTasksBySubGroup = (state, subGroupId) => {
  const sub = state.todo.groups.flatMap((g) => g.subGroups).find((s) => s._id === subGroupId);
  if (!sub) return [];
  return sub.tasks.sort(
    (a, b) =>
      priorityOrder[a.priority] - priorityOrder[b.priority] || new Date(a.date) - new Date(b.date)
  );
};
