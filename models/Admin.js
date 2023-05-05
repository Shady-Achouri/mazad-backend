const mongoose = require("mongoose");
const { ROLE_ADMIN } = require("../static");

const adminSchema = new mongoose.Schema(
  {
    lastName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    email: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "/admins/no-profile.jpg",
    },
    deleted: { type: Boolean, default: false },
    // notifications: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Notifications",
    //   },
    // ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  }
);

module.exports = mongoose.model("Admin", adminSchema);
