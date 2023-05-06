const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { GroupModel, UserModel } = require("../Models");

dotenv.config();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  UserModel.findOne({username: username})
  .then(async (data) => {
    if(data)
      return res.status(400).json({ message: "User already exists" });
    else{
        // Create new user
        const newUser = { username, password: password };
        const addedUser = await UserModel.create(newUser);
        
        // Generate and return auth token
        const authToken = jwt.sign({ username }, process.env.SECRET_KEY);
        
        return res.status(201).json({ authToken, id: addedUser._id});
    }
  })
  .catch((e) => {
    return res.status(400).json({ message: "Error occured" });
  })
});


router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Find user with matching credentials
  const user = await UserModel.findOne({username: username, password: password})

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  
  // Generate and return auth token
  const authToken = jwt.sign({ username }, process.env.SECRET_KEY);
  res.status(200).json({ authToken: authToken , id: user._id});
});


router.get("/all", async (req, res) => {
  const data = await UserModel.find({}, {username:1, _id:1});
  res.send(data);
});

module.exports = router;