import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";
const VAPID_PUBLIC_KEY =
  "BAdG3eDzTUy9Lb2Mvpsoxsr00c7hS5Uk5q64Bc4uVk-mvN3c95XvlDc8uE9KVnQVl2-coP4Y0DpJRJ9bs3qSLKg";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ text: "", date: "", reminder: false });

  // Fetch tasks
  useEffect(() => {
    if (token) {
      axios
        .get(`${API_BASE}/tasks`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setTasks(res.data))
        .catch(console.error);
    }
  }, [token]);
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${API_BASE}/users/google-login`, {
        credential: credentialResponse.credential,
      });

      const { token } = res.data;

      // Save token in state
      setToken(token);
      setUser(user);

      // ✅ Save token in localStorage
      localStorage.setItem("app_token", token);
      localStorage.setItem("app_user", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = () => {
    if (!newTask.text) return alert("Task text required");
    axios
      .post(`${API_BASE}/tasks`, newTask, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setNewTask({ text: "", date: "", reminder: false });
      })
      .catch(console.error);
  };

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

      alert("Subscribed to push notifications!");
    } catch (err) {
      console.error(err);
      alert("Push subscription failed.");
    }
  };

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
  }

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <GoogleLogin onSuccess={handleLoginSuccess} onError={() => alert("Login Failed")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          {/* <h1 className="text-2xl font-bold text-gray-800">Hello, {user.name}</h1> */}
          <button
            onClick={subscribeToPush}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Enable Push
          </button>
        </div>

        <div className="mb-6 space-y-2">
          <input
            placeholder="Task text"
            value={newTask.text}
            onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="datetime-local"
            value={newTask.date}
            onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newTask.reminder}
              onChange={(e) => setNewTask({ ...newTask, reminder: e.target.checked })}
              className="h-4 w-4 text-blue-500 focus:ring-blue-400"
            />
            <span className="text-gray-700">Reminder</span>
          </label>
          <button
            onClick={addTask}
            className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Add Task
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks</h2>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="p-3 bg-gray-100 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{task.text}</p>
                <p className="text-sm text-gray-500">
                  {task.date ? new Date(task.date).toLocaleString() : "No date"} | Reminder:{" "}
                  {task.reminder ? "Yes" : "No"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
