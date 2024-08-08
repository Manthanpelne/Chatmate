import React, { useContext, useEffect, useState } from 'react'
import axios from "axios"
import { ChatContext } from '../context/ChatProvider'
import { Box, Button } from '@chakra-ui/react'
import SideDrawer from '../components/SideDrawer'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'

const ChatPage=()=> {
  const [fetchMyChatAgain, setFetchMyChatAgain] = useState(false)

  const {user} = useContext(ChatContext)

  return (
   <div style={{width : "100%", padding:"10px"}}>
    {user && <SideDrawer/>}
    <Box w="100%" h="91.5vh" p="10px">
    <div style={{display:"flex", justifyContent:"space-between"}}>
    {user && <MyChats fetchMyChatAgain={fetchMyChatAgain}/>}
    {user && <ChatBox fetchMyChatAgain={fetchMyChatAgain}  setFetchMyChatAgain={setFetchMyChatAgain}/>}
      </div>
    </Box>
   </div>
  )
}

export default ChatPage