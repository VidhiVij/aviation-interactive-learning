require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

async function updateAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const admin = await Admin.findOne({ username: "admin" });

    if (!admin) {
      console.log("Admin not found, creating new admin...");
      const newAdmin = new Admin({
        username: "admin",
        password: "Aviation@project"   // 🔴 NEW PASSWORD
      });
      await newAdmin.save();
      console.log("Admin created with new password");
    } else {
      admin.password = "Aviation@project"; // 🔴 NEW PASSWORD
      await admin.save(); // bcrypt will hash automatically
      console.log("Admin password updated successfully");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
}

updateAdminPassword();
