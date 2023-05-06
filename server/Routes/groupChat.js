const express = require("express");
const router = express.Router();

const { GroupModel, UserModel } = require("../Models");

/**
 * Route: /all
 * Method: GET
 * Description: Get all chat Group details
 * Access: Public
 * Parameters: none
 */
router.get("/all", async (req, res) => {
  const allGroups = await GroupModel.find({}, { name: 1, _id: 1 , messages: 1});
  if (allGroups) {
    res.send(allGroups);
    return;
  }
  res.send({ message: "no group exist" });
});

/**
 * Route: /chats/:id
 * Method: GET
 * Description: Get all chats of the group in reverse
 * Access: Public
 * Parameters: id
 */
router.get("/chats/:id", async (req, res) => {
  const groupChat = await GroupModel.find(
    { _id: req.params.id },
    { name: 1, messages: 1 }
  ).catch(err => console.error(err) );
  if (groupChat) {
    res.send(groupChat);
    return;
  }
  res.status(404).send({ message: "No such Chat Group" });
});

/**
 * Route: /create
 * Method: POST
 * Description: Creates new chat group
 * Access: Public
 * Parameters: none
 */
router.post("/create", async (req, res) => {
  const { name } = req.body;

  // Check if user already exists
  const val = await GroupModel.find({ name: name });
  if (val.length != 0) {
    return res.status(400).json({ message: "Group already exists" });
  }

  // Create new user
  const newGC = { name };
  GroupModel.create(newGC);

  res.send({ success: true });
});

router.post("/send/:id", async (req, res) => {
  const { fromUser, text, time } = req.body;
  if (!time) time = Date.now();

  const groupID = req.params.id;
  const userID = await UserModel.findOne({ _id: fromUser }, {_id:1, username:1});
  console.log(userID, userID.username)
  if (!userID) {
    res.status(402).send({ message: "No such user exists" });
  }

  await GroupModel.updateOne(
    { _id: groupID },
    {
      $push: {
        messages: {
          fromUser: userID._id,
          sender: userID.username,
          text: text,
          time: time,
        },
      },
    }
  ).catch(() => {
    return res.status(400).json({ message: "Group doesn't exists" });
  });
  res.send({ success: true });
});

module.exports = router;
