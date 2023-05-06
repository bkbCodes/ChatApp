import axios from "axios";
import { convertToHTML } from "draft-convert";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../Context/ChatContext";
import RichTextEditor from "./RichTextEditor";

const ChatWindow = () => {
  const {
    userId,
    userName,
    authToken,
    groupId,
    groupName,
    setGroupId,
    setUserName,
    setGroupName,
    setAuthToken,
  } = useContext(MyContext);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setInterval(() => {
      if (!groupId) return;
      axios
        .get("/group/chats/" + groupId)
        .then((res) => {
          setMessages(res.data[0].messages);
        })
        .catch((err) => console.error(err));
    }, 500);
  });

  return (
    <div className="flex-auto flex flex-col justify-between bg-slate-800 text-slate-200">
      <div className="">
        <h1 className="text-2xl font-bold px-4 py-2 bg-green-600">
          {groupName}
        </h1>
        <div className="container flex flex-col gap-2 p-4 w-auto h-[75vh] overflow-y-scroll relative">
          {messages.map((value, index) => {
            if (value.fromUser !== userId)
              return (
                <div
                  className="flex gap-4 w-full max-w-2/3 items-center"
                  key={index}
                >
                  <p className="w-[30px] h-[30px] rounded-full bg-slate-400 items-center text-center text-black font-bold">
                    {value.sender[0]}
                  </p>
                  <p className="py-1 px-4 bg-slate-200 text-black rounded-md">
                    {value.text}
                  </p>
                </div>
              );

            return (
              <div
                className="flex gap-4 w-full max-w-2/3 items-center justify-end"
                key={index}
              >
                <p className="py-1 px-4 bg-slate-200 text-black rounded-md">
                  {value.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="textFormater p-1 bg-slate-950">
        <RichTextEditor />
      </div>
    </div>
  );
};

export default ChatWindow;
