const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

// Path to users.json
const usersFilePath = path.join(__dirname, "users.json");

// Read users from JSON file
function getUsers() {
  const data = fs.readFileSync(usersFilePath, "utf-8");
  return JSON.parse(data);
}

// Health check (industry standard)
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ================= LOGIN ROUTE =================
// 🔴 NOTE: async is REQUIRED because we use await
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.json({
      success: false,
      message: "Missing credentials"
    });
  }

  const users = getUsers();

  // Find user by username ONLY
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.json({
      success: false,
      message: "Invalid username or password"
    });
  }

  // Compare hashed password
  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    return res.json({
      success: true,
      message: "Login successful"
    });
  } else {
    return res.json({
      success: false,
      message: "Invalid username or password"
    });
  }
});

// IMPORTANT: Render uses process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
