require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.error(err));

async function createAdmin() {
  try {
    const exists = await Admin.findOne({ username: "admin" });
    if (!exists) {
      const admin = new Admin({
        username: "admin",
        password: "admin123"
      });
      await admin.save();
      console.log("Admin created in Atlas");
    } else {
      console.log("Admin already exists");
    }
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
