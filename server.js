const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

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

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      success: false,
      message: "Missing credentials"
    });
  }

  const users = getUsers();

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    res.json({
      success: true,
      message: "Login successful"
    });
  } else {
    res.json({
      success: false,
      message: "Invalid username or password"
    });
  }
});

// IMPORTANT: use process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
