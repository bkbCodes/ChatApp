import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MyContext } from "../Context/ChatContext";

const SideBar = () => {
  const [groupDetails, setGroupDetails] = useState([]);
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

  useEffect(() => {
    setTimeout(() => {
      axios
        .get("/group/all")
        .then((res) => {
          // console.log(res.data);
          setGroupDetails(res.data);
        })
        .catch((err) => console.error(err));
    }, 500);
  }, [groupDetails]);

  const openGroupChat = (e) => {
    let ele = e.target;
    while (!ele.className.includes("card")) {
      ele = ele.parentElement;
    }
    setGroupId(ele.dataset.id);
    setGroupName(ele.dataset.gcName);
  };

  return (
    <>
      <div className="w-[25%] h-full bg-slate-900 text-slate-200 px-4 flex flex-col justify-between">
        <div className="top">
          <h1 className="text-3xl font-semibold my-6">Groups:</h1>
          <div className="container my-3 flex-auto flex flex-col gap-4 overflow-y-scroll">
            {groupDetails.map((value) => {
              let LastMessage = value.messages;
              if (LastMessage.length > 0) {
                console.log("value:", value);
                return (
                  <div
                    className="border-slate-100 border-solid border-b py-2 px-4 hover:cursor-pointer card"
                    key={value._id}
                    data-gc-name={value.name}
                    data-id={value._id}
                    onClick={openGroupChat}
                  >
                    <h3 className="text-slate-200 font-semibold text-2xl">
                      {value.name}
                    </h3>
                    <p className="text-slate-400">
                      {LastMessage[LastMessage.length - 1].sender} :{" "}
                      {LastMessage[LastMessage.length - 1].text.slice(0, 30)}
                    </p>
                  </div>
                );
              }
              return (
                <div
                  className="border-slate-100 border-solid border-b py-2 px-4 hover:cursor-pointer card"
                  key={value._id}
                  data-gc-name={value.name}
                  data-id={value._id}
                  onClick={openGroupChat}
                >
                  <h3 className="text-slate-200 font-semibold text-2xl">
                    {value.name}
                  </h3>
                  <p className="text-slate-400">Start Chat now!</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="account my-6 text-2xl text-slate-300 font-semibolds">
          @{userName}
        </div>
      </div>
    </>
  );
};

export default SideBar;
