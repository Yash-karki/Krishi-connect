const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");

const User = require("./models/userModel");

const app = express();

/* ---------- Middleware ---------- */
app.use(express.urlencoded({ extended: true }));       // parse form data
app.use(express.json());                               // (optional) parse JSON
app.use(express.static(path.join(__dirname, "public"))); // serve /public
app.use(
  session({
    secret: "krishi_connect_secret", // change in production
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
  })
);

app.use(express.static(path.join(__dirname, "public")));

/* ---------- MongoDB ---------- */
mongoose
  .connect("mongodb://127.0.0.1:27017/krishiConnect", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

/* ---------- Helpers ---------- */
function requireAuth(req, res, next) {
  if (!req.session.userId) return res.redirect("/index.html");
  next();
}

/* ---------- Routes ---------- */
// Root -> login page
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// (Optional) Signup create user
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Redirect to login page after signup
    res.redirect("/home.html");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up user");
  }
});



// Login -> verify & redirect to Home.html
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Note: name field bhi form me hai, par auth ke liye email+password kaafi hai
    if (!email?.trim() || !password) {
      return res.status(400).send("Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).send("❌ User not found. <a href='/index.html'>Try again</a>");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).send("❌ Invalid password. <a href='/index.html'>Try again</a>");

    // Save session
    req.session.userId = user._id.toString();
    req.session.name = user.name;

    // Redirect to Home.html (static)
    return res.redirect("/Home.html");
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
  }
});

// Example protected file route (If you ever want to enforce auth for Home)
app.get("/home-protected", requireAuth, (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "Home.html"));
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/frontend/index.html");
  });
});

/* ---------- Start ---------- */
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
