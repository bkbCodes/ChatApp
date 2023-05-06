import React from 'react'
import ChatWindow from '../Components/ChatWindow'
import SideBar from '../Components/SideBar'

const Chats = () => {
  return (
    <>
    <div className="flex h-[100vh] w-[100vw]">
        <SideBar />
        <ChatWindow />
    </div>
    </>
  )
}

export default Chats