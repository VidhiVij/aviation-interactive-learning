const mongoose = require("mongoose");
const Admin = require("./models/Admin");

mongoose.connect('mongodb://127.0.0.1:27017/aviation')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

async function createAdmin() {
  try {
    const exists = await Admin.findOne({ username: "admin" });
    if (!exists) {
      const admin = new Admin({ username: "admin", password: "admin123" });
      await admin.save();
      console.log("Admin created");
    } else {
      console.log("Admin already exists");
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
