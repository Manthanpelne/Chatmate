import { Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { color } from 'framer-motion'
import React, { useContext, useState } from 'react'
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import { ChatContext } from '../context/ChatProvider'
import { useNavigate } from 'react-router-dom'
import StyledButton from './Button'
import axios from "axios"
import Loader from './Loader'
import UserListItem from './User Info/UserListItem'
import ProfileModal from './modals/ProfileModal'
import GetSender from './GetSender'
import NotificationBadge, { Effect } from "@parthamk/notification-badge"

const SideDrawer = () => {
    const [search, setSearch]= useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const navigate = useNavigate()
    const toast = useToast()

    const {user, chats, setChats, setSelectedChat, selectedChat, notification, setNotification} = useContext(ChatContext)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()


    const logoutHandler = ()=>{
        localStorage.removeItem("userInfo")
        navigate("/")
    }

    const accessChat=async(userId)=>{
    try {
        const config ={
            headers:{
            "Content-type":"application/json",
            Authorization: `Bearer ${user.token}`
            }
        }
        const {data} = await axios.post("https://chatmate-3z3z.onrender.com/api/chat",{userId},config)
        if(!chats.find((c)=>c._id===data.id)){
            setChats([data, ...chats])
        }
        setSelectedChat(data)
        setLoadingChat(data)
        onClose()
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

    const handleSearch=async()=>{
        try {
            setLoading(true)
            const config = {
               headers:{
                   Authorization: `Bearer ${user.token}`
               }
            }
            const {data} = await axios.get(`https://chatmate-3z3z.onrender.com/api/user?search=${search}`,config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title:"Error occured",
                description:"Failed to load results",
                status:"error",
                duration:"3000",
                isClosable:true,
                position:"top"
            })
        }

    }

  return (
   <>
   <Box style={{ display:"flex", justifyContent:"space-between", alignItems:"center", backgroundColor:"black", width:"100%" ,padding:"5px 10px 5px 10px", marginBottom:"10px"}}>
    <Tooltip label="Search users you want to chat with" hasArrow placement='bottom-end' bg="white" color="black">
    <Button ref={btnRef} onClick={onOpen}>
        <ion-icon name="search-outline"></ion-icon>
        {/* <Text d={{base:"none" ,md:"flex"}} px="1" pb="1">search user</Text> */}
    </Button>
    </Tooltip>
    <Text fontSize="2xl" fontFamily="Bodoni Moda" color="white">CHAT-MATE</Text>
    <div>
        <Menu>
                <Tooltip label="Notifications" hasArrow placement='bottom-end' bg="white" color="black">
            <MenuButton p={1}>
                <NotificationBadge 
                count={notification.length}
                effect={Effect.SCALE}
                />
                <BellIcon fontSize="2xl" m={1} color="white"/>
            </MenuButton>
                </Tooltip>
            <MenuList pl={2}>
                {!notification.length && "No new messages"}
                {notification.map((notify)=>(
                    <MenuItem key={notify._id} onClick={()=>{
                        setSelectedChat(notify.chat)
                        setNotification(notification.filter((f)=>f!=notify))
                    }}>
                        {notify.chat.isGroupChat
                        ? `New Message in group ${notify.chat.chatName}` :
                         `New Message from ${GetSender(user, notify.chat.users)}`
                        }
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>

            <Menu>
               <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
               <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
               </MenuButton>
               <MenuList>
                <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
                </ProfileModal>
                <MenuDivider/>
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
               </MenuList>
            </Menu>
    </div>
   </Box>

   {/* //sidebar */}
   <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search for users</DrawerHeader>
          <DrawerBody>
            <Box display="flex">
            <Input placeholder='search by name or email' mr={2} value={search} onChange={(e)=>setSearch(e.target.value)} />
            <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading? <Loader/> : (
                searchResult?.map((user)=>(
                    <UserListItem 
                    key={user._id}
                    user={user}
                    handleFunction={()=>accessChat(user._id)}
                    />
                ))
            )}
            {loadingChat && <Loader/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

   </>
  )
}

export default SideDrawer