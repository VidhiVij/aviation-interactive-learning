require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas connected");

    const exists = await Admin.findOne({ username: "admin" });

    if (!exists) {
      const admin = new Admin({
        username: "admin",
        password: "admin123"
      });

      await admin.save();
      console.log("✅ Admin created successfully");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

seedAdmin();
