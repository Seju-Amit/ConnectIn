import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import Profile from "./models/profile.model.js";
import User from "./models/user.model.js";
import ConnectionRequest from "./models/connnections.model.js";
import Post from "./models/posts.model.js";
// import Comment from "./models/comment.model.js";
// import postRouter from "./routes/posts.routes.js";
// import userRouter from "./routes/user.routes.js";

import bcrypt from "bcrypt";
import crypto from "crypto";

import multer from "multer";
import PDFdocument from "pdfkit";
import fs from "fs";

dotenv.config();

const app = express();

app.use(cors());
// app.use("/", postRouter);
// app.use("/register", userRouter);
app.use(express.json());
app.use(express.static("uploads"));



// for uploading files of profile picture for our existing user :
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

// manual way of creating pdf of data :

// converUserDataToPDF = async (profile) => {
//   const html = `
//     <html>
//       <head>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             margin: 0;
//             padding: 0;
//           }
//           .profile {
//             border: 1px solid #ccc;
//             padding: 10px;
//             margin: 10px;
//           }
//           .profile h2 {
//             margin: 0;
//           }
//           .profile p {
//             margin: 5px 0;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="profile">
//           <h2>${profile.name}</h2>
//           <p>${profile.email}</p>
//           <p>${profile.username}</p>
//         </div>
//       </body>
//     </html>
//   `;
//   const pdf = await pdfCreate(html);
//   return pdf;
// }


const converUserDataToPDF = async (userdata) => {

  const doc = new PDFdocument();

  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);

  doc.image(`uploads/${userdata.userId.ProfilePicture}`, { width: 100, height: 100 });
  doc.fontSize(16).text(`Name : ${userdata.userId.name}`);
  doc.fontSize(14).text(`Username : ${userdata.userId.username}`);
  doc.fontSize(14).text(`Email : ${userdata.userId.email}`);
  doc.fontSize(14).text(`Bio : ${userdata.bio}`);
  doc.fontSize(14).text(`Current Post : ${userdata.currentPost}`);
  doc.fontSize(14).text('Education :')
  userdata.education.forEach((education, index) => {
    doc.fontSize(13).text(`  school : ${education.school || 'N/A'}`);
    doc.fontSize(13).text(`  degree :${education.degree || 'N/A'}`);
    doc.fontSize(13).text(`  fieldOfStudy :${education.fieldOfStudy || 'N/A'}`);
  })

  doc.fontSize(14).text('PastWork :')
  userdata.work.forEach((work, index) => {
    doc.fontSize(13).text(`  comapany : ${work.company || 'N/A'}`);
    doc.fontSize(13).text(`  Position :${work.position || 'N/A'}`);
    doc.fontSize(13).text(`  Years :${work.years || 'N/A'}`);
  })

  doc.end();
}

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/welcome", (req, res) => {
  res.send("welcome ... Server is Live !");
});

app.post("/register", async (req, res) => {
  // const {name} = req.body;
  // const { name, email, password, username } = req.body;

  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();

    const profile = new Profile({
      userId: newUser._id,
    });

    await profile.save();

    return res.json({ message: "User created Successfully " });

  } catch (error) {
    return res.json({ message: "error occured" });
  }
});

app.post("/login", async (req, res) => {

  console.log("🔥 Login endpoint hit");
  console.log("🔑 Body:", req.body);

  const { email, password } = req.body;

    //  return res.console.log(req.body);
  try {
    
    const {email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exists" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ token });

    return res.json({ token : token});

  } catch (error) {
    return res.json({ message: "error occured" });
  }
});


// Replace the existing /update_Profile_Picture route with this:
app.post("/update_Profile_Picture", upload.single('ProfilePicture'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const token = req.body.token;
  const ProfilePicture = req.file.filename;
  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    user.ProfilePicture = ProfilePicture;

    await user.save();

    return res.json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({ message: "Error occurred" });
  }
});


// Replace the existing update_user route with this fixed version
app.post("/update_user", async (req, res) => {
  const { token, ...newUserData } = req.body;
  try {
    const user = await User.findOne({ token });
    
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    
    // Check if email or username already exists
    if (newUserData.email || newUserData.username) {
      const existingUser = await User.findOne({
        $or: [
          { email: newUserData.email },
          { username: newUserData.username }
        ],
        _id: { $ne: user._id }
      });

      if (existingUser) {
        return res.status(400).json({ message: "Email or username already in use" });
      }
    }
    
    // Hash password if it's being updated
    if (newUserData.password) {
      const salt = await bcrypt.genSalt(10);
      newUserData.password = await bcrypt.hash(newUserData.password, salt);
    }

    // Update user data
    Object.assign(user, newUserData);
    await user.save();

    return res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});


app.get("/get_user_and_profile", async (req, res) => {
    try{

        const token = req.query.token;
        const user = await User.findOne({ token: token });

        if (!user) {
          return res.status(404).json({ message: "User does not exist" });
        }

        const userProfile = await Profile.findOne({ userId: user._id })
        .populate('userId', 'name username email ProfilePicture');

        // Get user's connections
        const connections = await ConnectionRequest.find({
          $or: [
            { userId: user._id, status: "accepted" },
            { connectionId: user._id, status: "accepted" }
          ]
        })
        .populate('userId', 'name username email ProfilePicture')
        .populate('connectionId', 'name username email ProfilePicture');

        // Get pending connection requests
        const connectionRequest = await ConnectionRequest.find({
          connectionId: user._id,
          status: { $ne: "accepted" }
        })
        .populate('userId', 'name username email ProfilePicture');

        return res.json({userProfile, connections, connectionRequest});
      } catch(error) {
        return res.json({ message: "error occurred" });
      }
});


app.post("/update_Profile_Data", async (req , res) => {

    // return res.json({message:"hello"});
    try{
        const { token, ...newUserData } = req.body;

        const userProfile = await User.findOne({ token: token });
        // return res.console.log(userProfile);
        if (!userProfile) {
          return res.status(404).json({ message: "User does not exist" });
        }

        const profieToUpdate = await Profile.findOne({ userId: userProfile._id });
        Object.assign(profieToUpdate, newUserData);

        await profieToUpdate.save();
        return res.json({ message: "Profile updated successfully" });
    
    } catch(error) {
        return res.json({ message: "error occured" });
    }
})


app.get("/user/get_All_Users", async (req, res) => {
    try {
      const profiles = await Profile.find()
      .populate('userId', 'name username email ProfilePicture');

      return res.json(profiles);
    } catch (error) {
      return res.json({ message: "error occured" });
    }
});


app.get("/user/download_resume", async(req, res) => {

  const Id = req.query.id;

  const profile = await Profile.findOne({ _id: Id })
  .populate('userId', 'name username email ProfilePicture');

  const outputPath = await converUserDataToPDF(profile);
  
  return res.json({ "message " : outputPath});

});


app.post("/user/send_connection_request", async (req, res) => {

  const {token , connectionId} = req.body;

  try {

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const connectUser = await User.findOne({ _id: connectionId });

    if (!connectUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const existingRequest = await ConnectionRequest.findOne(
      { 

        userId : user._id,
        connectionId : connectUser._id
      })

    if (existingRequest) {
      return res.status(400).json({ message: "Connection request already sent" });
    }

    const request = new ConnectionRequest({
      userId : user._id,
      connectionId : connectUser._id
    });

    await request.save();

    return res.json({ message: "Connection request sent successfully" });

  } catch(error) {
    return res.json({ message: "error occured" });
  }

})


app.get("/user/get_my_connection_request", async (req, res) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const connections = await ConnectionRequest.findOne({ userId : user._id })
    .populate('connectionId', 'name username email ProfilePicture');

    return res.json({connections});

  } catch(error) {
    return res.json({ message: "error occured" });
  }
});

app.get("/user/user_connection_request", async (req, res) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const connections = await ConnectionRequest.find({ userId : user._id })
    .populate('userId', 'name username email ProfilePicture');

    return res.json(connections);

  } catch(error) {
    return res.json({ message: "error occured" });
  }
});


app.post("/user/accept_connection_request", async (req, res) => {
  
  const {token , requestId, action_Type} = req.body;

  try{

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const connection = await ConnectionRequest.findOne({ _id: requestId});
    if (!connection) {
      return res.status(404).json({ message: "Connection request does not exist" });
    }

    if (action_Type === "accept") {
      connection.status = "accepted";
    } else {
      connection.status = "rejected";
    }

    await connection.save();

    return res.json({ message: "request updated" });

  } catch(error) {
    return res.json({ message: "error occured" });
  } 

})


app.post("/user/delete_connection_request", async (req, res) => {
  
  const {token , requestId} = req.body;

  try{

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const connection = await ConnectionRequest.findOne({ _id: requestId});
    if (!connection) {
      return res.status(404).json({ message: "Connection request does not exist" });
    }

    await connection.deleteOne();

    return res.json({ message: "request deleted" });

  } catch(error) {
    return res.json({ message: "error occured" });
  } 


})


app.post("/create_post", upload.single('media'), async (req, res) => {

  const {token } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const post = new Post({
      userId : user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/") [1] : "",
    });
    await post.save();
    return res.json({ message: "Post created successfully" });

  } catch(error) {
    return res.json({ message: "error occured" });
  }

});


app.get("/all_posts", async (req, res) => {

  try {
    const posts = await Post.find().populate('userId', 'name username email ProfilePicture');
    return res.json(posts);
  } catch(error) {
    return res.json({ message: "error occured" });
  }
})


app.post("/delete_post", async (req, res) => {

  const {token , post_Id} = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const post = await Post.findOne({ id: post_Id});

    if (!post) {
      return res.status(404).json({ message: "Post does not exist" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await post.deletePost({ _id : post_Id});

    return res.json({ message: "post deleted" });

  } catch(error) {
    return res.json({ message: "error occured" });
  }
})


app.post("/comment_on_post", async (req, res) => {

  const {token , post_Id, commentBody} = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const post = await Post.findOne({ id: post_Id});

    if (!post) {
      return res.status(404).json({ message: "Post does not exist" });
    }

    const newComment = new Comment({
      userId: user._id,
      postId: post._id,
      commment : commentBody,
    });

    await newComment.save();

    return res.json({ message: "comment added" });

  } catch(error) {
    return res.json({ message: "error occured" });
  }
})


app.get("/all_comments", async (req, res) => {

  const {post_Id} = req.body;

  try {
    const post = await Post.findOne({ id: post_Id});
    if (!post) {
      return res.status(404).json({ message: "Post does not exist" });
    }
    const comments = await Comment.find({ postId: post._id }).populate('userId', 'name username email ProfilePicture');
    const sortedComments = comments.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.json(sortedComments);

  } catch(error) {
    return res.json({ message: "error occured" });
  }
})


app.delete("/delete_comment", async (req, res) => {

  const {token , comment_Id, post_Id} = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const post = await Post.findOne({ id: post_Id});

    if (!post) {
      return res.status(404).json({ message: "Post does not exist" });
    }

    const comment = await Comment.findOne({ id: comment_Id});

    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }

    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await comment.deleteComment({ _id : comment_Id});

    return res.json({ message: "comment deleted" });

  } catch(error) {
    return res.json({ message: "error occured" });
  }
});


app.post("/like_post", async (req, res) => {

  const {token , post_Id} = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const post = await Post.findOne({ id: post_Id});

    if (!post) {
      return res.status(404).json({ message: "Post does not exist" });
    }

    if (post.likes.includes(user._id)) {
      post.likes.pull(user._id);
    } else {
      post.likes.push(user._id);
    }

    await post.save();

    return res.json({ message: "post liked" });
    } catch(error) {
      return res.json({ message: "error occured" });
    }
});


// Add this new route for banner picture upload
app.post("/update_Profile_Banner", upload.single('bannerPicture'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const token = req.body.token;
  const bannerPicture = req.file.filename;
  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    user.bannerPicture = bannerPicture;

    await user.save();

    return res.json({ message: "Banner picture updated successfully" });
  } catch (error) {
    console.error("Error updating banner picture:", error);
    return res.status(500).json({ message: "Error occurred" });
  }
});


const port = 8000;
const start = async () => {
  const mongoDB = await mongoose
    .connect(
      "mongodb+srv://amitseju04:amitseju100@connectin.2i9d3xo.mongodb.net/ConnectIn?retryWrites=true&w=majority&appName=connectIn"
    )
    .then(() => {
      console.log("Database connected");
    })
  .catch((err) => {
      console.log(err);
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};

start();


// Add these imports at the top of your file
import { createServer } from "http";
import { Server } from "socket.io";

// After your Express app initialization
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle new comments
  socket.on("new_comment", (comment) => {
    // Broadcast to all clients except sender
    socket.broadcast.emit("comment_added", comment);
  });

  // Handle new posts
  socket.on("new_post", (post) => {
    socket.broadcast.emit("post_added", post);
  });

  // Handle likes
  socket.on("post_liked", (data) => {
    socket.broadcast.emit("like_updated", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Change your app.listen to httpServer.listen
httpServer.listen(process.env.PORT || 8000, () => {
  console.log(`Server running on port ${process.env.PORT || 8000}`);
});
