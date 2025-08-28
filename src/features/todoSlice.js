import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk fetching nested task data with token auth header from localStorage
export const fetchTasks = createAsyncThunk("todo/fetchTasks", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No auth token found");
    }
    const response = await fetch("http://localhost:5000/api/tasks/nested", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return rejectWithValue("Failed to fetch tasks");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// 1️⃣ Async thunk for completing a task via API
export const completeTaskAPI = createAsyncThunk(
  "todo/completeTaskAPI",
  async ({ taskId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/complete`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.message || "Failed to complete task");
      }
      return { taskId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialToken = localStorage.getItem("token");

const initialState = {
  token: initialToken || null,
  groups: [],
  status: "idle",
  error: null,
  activeTab: null,
  activeGroup: null,
  activeSubGroup: null,
  pendingUndo: [],
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    clearToken(state) {
      state.token = null;
      state.groups = [];
      state.status = "idle";
      state.error = null;
      state.activeTab = null;
      state.activeGroup = null;
      state.activeSubGroup = null;
      localStorage.removeItem("token");
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
      state.activeGroup = null;
      state.activeSubGroup = null;
    },
    setActiveGroup(state, action) {
      state.activeGroup = action.payload;
      state.activeTab = null;
      state.activeSubGroup = null;
    },
    setActiveSubGroup(state, action) {
      state.activeSubGroup = action.payload;
      state.activeTab = null;
      state.activeGroup = null;
    },

    removeTaskOptimistic: (state, action) => {
      const { taskId, taskData } = action.payload;

      // Add the full task object to pendingUndo
      state.pendingUndo.push(taskData);

      // Remove task from all subgroups
      state.groups.forEach((group) => {
        group.subGroups?.forEach((sub) => {
          sub.tasks = sub.tasks?.filter((task) => task._id !== taskId) || [];
        });
      });
    },

    // ✅ 3️⃣ Restore task on Undo
    // In your slice: restoreTask
    restoreTask: (state, action) => {
      const { task } = action.payload;

      // Find the parent group containing the subGroup
      const parentGroup = state.groups.find((g) =>
        g.subGroups?.some((sg) => sg._id === task.subGroupId)
      );

      if (parentGroup) {
        const parentSubGroup = parentGroup.subGroups.find((sg) => sg._id === task.subGroupId);

        // Insert task sorted by date
        if (parentSubGroup) {
          const tasks = parentSubGroup.tasks || [];
          // Prevent duplicates
          if (!tasks.some((t) => t._id === task._id)) {
            // Find proper index to insert
            const index = tasks.findIndex((t) => new Date(t.date) > new Date(task.date));
            if (index === -1) {
              tasks.push(task); // insert at end if all tasks are earlier
            } else {
              tasks.splice(index, 0, task); // insert at correct position
            }
            parentSubGroup.tasks = tasks;
          }
        }
      }

      // Remove from pending undo queue
      state.pendingUndo = state.pendingUndo.filter((t) => t._id !== task._id);
    },
    finalizeTask: (state, action) => {
      const { taskId } = action.payload;
      state.pendingUndo = state.pendingUndo.filter((t) => t._id !== taskId);
    },
    updateTask: (state, action) => {
      const updatedTask = action.payload;
      const subGroup = state.groups
        .flatMap((g) => g.subGroups || [])
        .find((sg) => sg._id === updatedTask.subGroupId);

      if (!subGroup) return;

      updatedTask.subGroupName = subGroup.name;

      subGroup.tasks = (subGroup.tasks || []).map((t) =>
        t._id === updatedTask._id ? updatedTask : t
      );
    },

    addTask: (state, action) => {
      const task = action.payload;
      const subGroup = state.groups
        .flatMap((g) => g.subGroups || [])
        .find((sg) => sg._id === task.subGroupId);

      if (!subGroup) return;

      task.subGroupName = subGroup.name;

      const exists = (subGroup.tasks || []).some((t) => t._id === task._id);

      if (!exists) {
        const tasks = subGroup.tasks || [];
        if (task.date) {
          const insertIndex = tasks.findIndex((t) => new Date(t.date) > new Date(task.date));
          subGroup.tasks =
            insertIndex === -1
              ? [...tasks, task]
              : [...tasks.slice(0, insertIndex), task, ...tasks.slice(insertIndex)];
        } else {
          subGroup.tasks = [...tasks, task];
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.groups = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message;
      });
  },
});

// 🔹 Selectors
export const selectAllTasks = (state) => {
  let allTasks = [];
  for (const group of state.todo.groups) {
    for (const subGroup of group.subGroups || []) {
      allTasks = allTasks.concat(subGroup.tasks || []);
    }
  }
  return allTasks;
};

const isToday = (date) => {
  const d = new Date(date);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

export const selectTodayTasks = (state) => {
  const pendingUndoIds = state.todo.pendingUndo.map((t) => t._id);
  return selectAllTasks(state)
    .filter((task) => !pendingUndoIds.includes(task._id)) // exclude pending undo
    .filter((task) => task.date && isToday(task.date));
};

export const selectOverdueTasks = (state) => {
  const pendingUndoIds = state.todo.pendingUndo.map((t) => t._id);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // midnight today

  return selectAllTasks(state)
    .filter((task) => !pendingUndoIds.includes(task._id)) // exclude pending undo
    .filter(
      (task) =>
        task.date &&
        new Date(task.date) < todayStart && // strictly before today
        !task.completed
    );
};

export const selectUpcomingTasks = (state) => {
  const allTasks = selectAllTasks(state);
  const pendingUndoIds = state.todo.pendingUndo.map((t) => t._id);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return allTasks
    .filter((task) => !pendingUndoIds.includes(task._id)) // remove temporarily deleted tasks
    .filter((task) => task.date && new Date(task.date) >= todayStart && !task.completed)
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // SORT by date ascending
};

export const selectGroupsSummary = (state) =>
  state.todo.groups.map((group) => ({
    id: group._id,
    name: group.name,
    subGroups: (group.subGroups || []).map((subGroup) => ({
      id: subGroup._id,
      name: subGroup.name,
      color: subGroup.color,
    })),
  }));

// todoSlice.js
export const selectActiveGroupWithSubGroups = (state) => {
  const activeGroup = state.todo.activeGroup;
  if (!activeGroup) return null;

  const group = state.todo.groups.find((g) => g._id === activeGroup._id);
  if (!group) return null;

  return {
    id: group._id,
    name: group.name,
    subGroups:
      group.subGroups?.map((sg) => ({
        id: sg._id,
        name: sg.name,
        color: sg.color,
        tasks: sg.tasks || [], // ✅ include tasks
      })) || [],
  };
};

export const selectTasksOfActiveSubGroup = (state) => {
  const activeSubGroup = state.todo.activeSubGroup;
  if (!activeSubGroup)
    return { normalTasks: [], overdueTasks: [], noDateTasks: [], subGroup: null };

  const pendingUndoIds = state.todo.pendingUndo.map((t) => t._id);

  // ✅ Get the fresh subGroup from groups
  const subGroup = state.todo.groups
    .flatMap((g) => g.subGroups || [])
    .find((sg) => sg._id === activeSubGroup._id);

  if (!subGroup) return { normalTasks: [], overdueTasks: [], noDateTasks: [], subGroup: null };

  const tasks = (subGroup.tasks || []).filter((task) => !pendingUndoIds.includes(task._id));

  const now = new Date();
  const overdueTasks = tasks.filter((task) => task.date && new Date(task.date) < now);
  const normalTasks = tasks.filter((task) => task.date && new Date(task.date) >= now);
  const noDateTasks = tasks.filter((task) => !task.date);

  return { normalTasks, overdueTasks, noDateTasks, subGroup };
};

// Selector to get all subGroups not task in it
export const selectAllSubGroups = (state) => {
  const groups = state.todo.groups || [];
  const allSubGroups = [];

  groups.forEach((group) => {
    group.subGroups?.forEach((sub) => {
      allSubGroups.push({ id: sub._id, name: sub.name });
    });
  });

  return allSubGroups;
};

export const selectGroups = (state) => state.todo.groups;
export const selectActiveTab = (state) => state.todo.activeTab;
export const selectActiveGroup = (state) => state.todo.activeGroup;
export const selectActiveSubGroup = (state) => state.todo.activeSubGroup;

export const {
  setToken,
  clearToken,
  setActiveTab,
  setActiveGroup,
  setActiveSubGroup,
  removeTaskOptimistic,
  restoreTask,
  finalizeTask,
  addTask,
  updateTask,
} = todoSlice.actions;

export default todoSlice.reducer;
