import express, { Router } from "express";

import{ register, login }from "../controllers/user.controllers.js";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
router.route("/update_Profile_picture")
.post(upload.single('ProfilePicture'),uploadProfilePicture)

router.post("register", register);
router.route("/login").post(login);

export default router;