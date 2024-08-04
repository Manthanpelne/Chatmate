import React, { useContext, useEffect, useState } from 'react'
import axios from "axios"
import { ChatContext } from '../context/ChatProvider'
import { Box, Button } from '@chakra-ui/react'
import SideDrawer from '../components/SideDrawer'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'

const ChatPage=()=> {

  const {user} = useContext(ChatContext)

  return (
   <div style={{width : "100%", padding:"10px"}}>
    {user && <SideDrawer/>}
    <Box border="1px solid red" w="100%" h="91.5vh" p="10px">
    <div style={{display:"flex", justifyContent:"space-between"}}>
    {user && <MyChats/>}
    {user && <ChatBox/>}
      </div>
    </Box>
   </div>
  )
}

export default ChatPage