import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from './SingleChat'

const ChatBox = ({fetchMyChatAgain, setFetchMyChatAgain}) => {

  const {selectedChat} = useContext(ChatContext)

  return (
   <Box display={{base:selectedChat? "flex" : "none", md:"flex"}}
   alignItems="center"
   flexDir="column"
   h="87vh"
   p={3}
   bg="black"
   w={{ base: "100%", md: "68%" }}
   borderRadius="lg"
   color="white"
   borderWidth="1px"
   >
  <SingleChat fetchMyChatAgain={fetchMyChatAgain} setFetchMyChatAgain={setFetchMyChatAgain}/>
   </Box>
  )
}

export default ChatBox