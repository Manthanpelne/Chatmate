import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import Loader from './Loader'
import GetSender from './GetSender'
import GroupChatModal from './modals/GroupChatModal'

const MyChats = ({fetchMyChatAgain}) => {
  const [loggedUser, setLoggedUser] = useState()
  const {user,selectedChat, setSelectedChat, chats, setChats} = useContext(ChatContext)
  const toast = useToast()

  console.log(chats)

  const fetchChats =async()=>{
  try {
    const {data} = await axios.get("http://localhost:4500/api/chat",{
      headers :{
        Authorization:`Bearer ${user.token}`
      }
    })
    setChats(data)
  } catch (error) {
    toast({
      title:"Error fetching chats",
      description:"Failed to load chats",
      status:"error",
      duration:"3000",
      isClosable:true,
      position:"top"
  })
  }
  }

  useEffect(()=>{
 setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
 fetchChats()
  },[fetchMyChatAgain])

  return (
    <>
      <Box display={{base:selectedChat ? "none":"flex", md:"flex"}}
      flexDirection="column"
      alignItems="center"
      p={3}
      borderRadius="lg"
      bg="black"
      w={{base:"100%", md:"31%"}}
      h="645px"
      >
       <Box
        pb={3}
        px={3}
        fontSize={{ base: "20px", md: "24px" }}
        display="flex"
        w="100%"
        color="white"
        justifyContent="space-between"
        alignItems="center"
       >
         MY CHATS
         <GroupChatModal>
          <Button
            d="flex"
            colorScheme='blue'
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
         </GroupChatModal>
       </Box>
           <Box
            display="flex"
            flexDir="column"
            p={3}
            bg="black"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
           >
            {chats? (
              <Stack>
               {chats.map((c)=>(
                <Box onClick={()=>setSelectedChat(c)} cursor="pointer" 
                bg={selectedChat === c ? "#b7b8b5" : "#E8E8E8"}
                color={selectedChat === c ? "black" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={c._id}
                >
                  <Text>{!c.isGroupChat? (
                    <div>
                      {GetSender(loggedUser,c.users)}
                      <Text fontSize="11px" fontWeight={700}>{c.createdAt.split("").splice(0,10)}</Text>
                    </div>
                  ):(
                  <div>
                    {c.chatName}
                    <Text fontSize="11px" fontWeight={700}>{c.createdAt.split("").splice(0,10)}</Text>
                  </div>
                  )
                  }
                  </Text>
                </Box>
               ))}
              </Stack>
            ):(
              <Loader style={{marginTop:"200px", marginLeft:"80px"}}/>
            )}
           </Box>
      </Box>
    </>
  )
}

export default MyChats