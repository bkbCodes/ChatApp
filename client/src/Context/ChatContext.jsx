import React, { createContext, useState } from "react";
import App from "../App";

export const MyContext = createContext();

const ChatContext = ({childern}) => {
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [groupId, setGroupId] = useState();
  const [authToken, setAuthToken] = useState();
  const [groupName, setGroupName] = useState();

  return (
    <MyContext.Provider value={{ userId, userName, groupId, groupName, authToken, setUserId, setUserName, setGroupId, setGroupName, setAuthToken}}>
      <App />
    </MyContext.Provider>
  );
}

export default ChatContext