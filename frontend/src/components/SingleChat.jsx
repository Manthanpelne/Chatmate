import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatProvider'
import { Box, Button, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import GetSender from "../components/GetSender"
import ProfileModal from './modals/ProfileModal'
import { FullSenderDetails } from '../components/GetSender'
import UpdateGroupChatModal from './modals/UpdateGroupChatModal'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'
import io from "socket.io-client"
import Lottie from "react-lottie"
import animationData from "./animations/typing.json"


 const ENDPOINT = "http://localhost:4500"
var socket, selectedChatCompare


const SingleChat = ({fetchMyChatAgain, setFetchMyChatAgain}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false)
  const toast = useToast();



    const {user, selectedChat, setSelectedChat, notification, setNotification} = useContext(ChatContext)
  
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };


  const fetchMessages=async()=>{
    if(!selectedChat) return
    try {
      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      setLoading(true)
      const {data} = await axios.get(`http://localhost:4500/api/message/${selectedChat._id}`,
      config
    )
    setMessages(data)
    socket.emit("join chat",selectedChat._id)
      setLoading(false)
    } catch (error) {
      toast({
        title:"Error Occured!",
        description:"Failed to load messages",
        status:"error",
        duration:"3000",
        isClosable:true,
        position:"top"
    })
    }
  }


  useEffect(()=>{
    socket = io(ENDPOINT)
    socket.emit("setup",user)
    socket.on("connected",()=>setSocketConnected(true))
    socket.on("typing",()=>setIsTyping(true))
    socket.on("stop typing",()=>setIsTyping(false))
    },[])


  useEffect(()=>{
  fetchMessages()
  selectedChatCompare = selectedChat
  },[selectedChat])



  useEffect(()=>{
    socket.on("message recieved", (newMessageRecieved)=>{
   if(!selectedChatCompare || selectedChatCompare._id!== newMessageRecieved.chat._id){
    //give notification
    if(!notification.includes(newMessageRecieved)){
      setNotification([newMessageRecieved, ...notification])
      setFetchMyChatAgain(!fetchMyChatAgain)
    }
   }else{
    setMessages([...messages, newMessageRecieved])
   }
    })
  })


    const sendMessage=async(e)=>{
    if(e.key=="Enter" && newMessage){
      socket.emit("stop typing", selectedChat._id)
    try {
      const config = {
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${user.token}`
        }
      }
      setNewMessage("")
      const {data} = await axios.post("http://localhost:4500/api/message",{
        content: newMessage,
        chatId: selectedChat._id,
      },
      config
    )
      //console.log(data)
      socket.emit("new message", data)
      setMessages([...messages, data])
    } catch (error) {
      toast({
        title:"Error Occured!",
        description:"Failed to send a message",
        status:"error",
        duration:"3000",
        isClosable:true,
        position:"top"
    })
    }
    }
    }



    const typeHandler=(e)=>{
    setNewMessage(e.target.value)
    //typing logic
    if(!socketConnected) return
    if(!typing){
      setTyping(true)
      socket.emit("typing", selectedChat._id)
    }

    let lastTypingTime = new Date().getTime()
    var timeLength = 1000

    setTimeout(() => {
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTypingTime
      if(timeDiff >= timeLength && typing){
        socket.emit("stop typing", selectedChat._id)
        setTyping(false)
      }
    }, timeLength);
    }



  return (
    <>
    {selectedChat? (
        <>
        <Text 
          fontSize={{ base: "22px", md: "26px" }}
          pb={1}
          px={2}
          w="100%"
          display="flex"
          border="1px solid grey"
          bg="#44454a"
          borderRadius={9}
          justifyContent={{ base: "space-between" }}
          alignItems="center"
        >
      <IconButton display={{base:"flex", md:"none"}} icon={<ArrowBackIcon/>} onClick={()=>setSelectedChat("")}/>
      {!selectedChat.isGroupChat ? (<>
      {GetSender(user, selectedChat.users)}
      <ProfileModal user={FullSenderDetails(user, selectedChat.users)} />
      </>):(<>
      {selectedChat.chatName}
      <UpdateGroupChatModal fetchMessages={fetchMessages} fetchMyChatAgain={fetchMyChatAgain} setFetchMyChatAgain={setFetchMyChatAgain}/>
      </>)}
        </Text>
        <Box
          display="flex"
          flexDir="column"
          justifyContent="flex-end"
          p={3}
          bg="black"
          w="100%"
          color="white"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
        {/* messages here */}
        {loading?(<Spinner
        size="xl" color='grey' w={20} h={20} alignSelf="center" margin="auto"
        />):(
         <div className='liveMessages'>
          {/* messages */}
          <ScrollableChat messages={messages}/>
         </div>
        )}
        
          <FormControl onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}>
              {istyping? <div><Lottie width={70} options={defaultOptions}
                style={{marginBottom:"15px", marginLeft:"0px" }}
              /></div> : <></>}
        <Input value={newMessage} onChange={typeHandler} className="input" placeholder="Click Enter to send a message...." />
          </FormControl>
        </Box>
        </>
    ):(
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="xl" pb={3} color="grey">
            Click on a user to start chatting
          </Text>
        </Box>
    )}
    </>
  )
}

export default SingleChat