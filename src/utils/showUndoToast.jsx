import toast from "react-hot-toast";
import { restoreTask, finalizeTask, completeTaskAPI } from "../features/todoSlice";

export const showUndoToast = (task, dispatch, token) => {
  let undoClicked = false;

  // Show toast with Undo button
  toast(
    (t) => (
      <div className="flex justify-between items-center">
        <span>Task marked complete</span>
        <button
          onClick={() => {
            undoClicked = true;
            dispatch(restoreTask({ task })); // Restore task to state
            toast.dismiss(t.id);
          }}
          className="ml-4 px-2 py-1 bg-gray-200 rounded text-sm"
        >
          Undo
        </button>
      </div>
    ),
    { duration: 3000 } // 3 seconds
  );

  // After 3 seconds, if Undo not clicked, finalize task
  setTimeout(() => {
    if (!undoClicked) {
      dispatch(finalizeTask({ taskId: task._id }));           // Remove from state permanently
      dispatch(completeTaskAPI({ taskId: task._id, token })); // Call API
    }
  }, 3000);
};
