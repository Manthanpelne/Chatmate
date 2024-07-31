import React, { useEffect, useState } from 'react'
import axios from "axios"

const ChatPage=()=> {

  const [chat,setChat] = useState([])

  const fetchChats =async()=>{
    const chats = await fetch("http://localhost:4500/api/chats")
      const data = await chats.json()
      setChat(data)
  }

  useEffect(()=>{
  fetchChats()
  },[])

  return (
    <div>{chat.map((item)=>(
      <span key={item.id}>{item.chatName}</span>
    ))}</div>
  )
}

export default ChatPage