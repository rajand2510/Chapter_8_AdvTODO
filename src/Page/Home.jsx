import React, { useEffect, useState } from "react";
import Completed from "../Components/Completed";
import TodayTask from "../Components/TodayTask";
import UpcomingTask from "../Components/UpcomingTask";
import GroupPage from "../Components/GroupPage";
import ProjectPage from "../Components/ProjectPage";
import RendContent from "../Components/RendContent";
import Sidebar from "../Components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, selectGroups } from "../features/todoSlice";
import axios from "axios";
import { Bell } from "lucide-react";

// Your constants
const token = localStorage.getItem("token");
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const API_BASE = import.meta.env.VITE_API_BASE;

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const Home = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectGroups);
  const status = useSelector((state) => state.todo.status);
  const error = useSelector((state) => state.todo.error);

  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());

    // Show modal only if permission not granted yet
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        setShowPermissionModal(true);
      } else {
        setShowPermissionModal(false);
      }
    }
  }, [dispatch]);

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      await axios.post(`${API_BASE}/notifications/subscribe`, subscription, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowPermissionModal(false);
      alert("✅ Subscribed to push notifications!");
    } catch (err) {
      console.error(err);
      alert("❌ Push subscription failed.");
    }
  };

  const handlePermission = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      alert("Push notifications not supported on this browser.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      subscribeToPush();
    } else {
      setShowPermissionModal(false);
      if (permission === "denied") {
        alert("❌ You denied notifications.");
      }
    }
  };

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex justify-between w-full">
        <RendContent />

        {/* Right-side button only if still not granted */}
        {Notification.permission !== "granted" && (
          <div className="p-4">
            <button
              onClick={handlePermission}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md"
            >
              Enable Push Notifications
            </button>
          </div>
        )}
      </div>

      {/* POPUP Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-[var(--tab-active)] flex items-center justify-center">
                <Bell className="w-8 h-8 text-[var(--icon-color)]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Enable Notifications</h3>
              <p className="text-sm text-gray-500 mb-6">
                Stay updated with reminders and important updates. Please allow notifications.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPermissionModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
                >
                  Later
                </button>
                <button
                  onClick={handlePermission}
                  className="px-4 py-2 rounded-lg bg-[var(--tab-active)] text-[var(--icon-color)] text-sm"
                >
                  Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
