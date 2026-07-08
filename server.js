const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

// ✅ IMPORT ROUTES
const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const recipientRoutes = require("./routes/recipientRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const compatibilityRoutes = require("./routes/compatibilityRoutes");
const allocationRoutes = require("./routes/allocationRoutes");
// ✅ IMPORT MIDDLEWARE (ADD HERE)
const verifyToken = require("./middleware/verifyToken");
const roleMiddleware = require("./middleware/roleMiddleware");

const app = express();

// 🔹 GLOBAL MIDDLEWARE
app.use(cors());
app.use(express.json());

app.use("/api/donor", donorRoutes);
app.use("/api/recipient", recipientRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/compatibility", compatibilityRoutes);
app.use("/api/medical", compatibilityRoutes);   // ← alias used by MedicalForm
app.use("/api/allocation", allocationRoutes);

// ✅ ROUTES
app.use("/api/auth", authRoutes);

// ✅ PROTECTED TEST ROUTE (ADD AFTER ROUTES)
app.get(
   "/protected",
   verifyToken,
   roleMiddleware("donor"),
   (req, res) => {
      res.json({ message: "Protected route accessed", user: req.user });
   }
);

// 🔹 DB CONNECTION TEST
(async () => {
   try {
      const connection = await db.getConnection();
      console.log("✅ MySQL Connected");
      connection.release();
   } catch (err) {
      console.log("❌ DB Connection Error:", err.message);
   }
})();

// 🔹 ROOT ROUTE
app.get("/", (req, res) => {
   res.send("🚀 Backend + DB Running");
});

// 🔹 SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));