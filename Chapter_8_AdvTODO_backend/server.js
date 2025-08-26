const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cron = require("./utils/scheduler");
const agenda = require("./config/agenda");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Enable CORS for all origins (or configure as needed)
app.use(cors());

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/subgroups", require("./routes/subGroups"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/history", require("./routes/historyRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

require("./utils/scheduler");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
