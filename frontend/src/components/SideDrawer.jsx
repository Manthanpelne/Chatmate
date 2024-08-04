import { Avatar, Box, Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip } from '@chakra-ui/react'
import { color } from 'framer-motion'
import React, { useContext, useState } from 'react'
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import { ChatContext } from '../context/ChatProvider'

const SideDrawer = () => {
    const [search, setSearch]= useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const {user} = useContext(ChatContext)

  return (
   <>
   <Box style={{ display:"flex", justifyContent:"space-between", alignItems:"center", backgroundColor:"black", width:"100%" ,padding:"5px 10px 5px 10px", marginBottom:"10px"}}>
    <Tooltip label="Search users you want to chat with" hasArrow placement='bottom-end' bg="white" color="black">
    <Button>
        <ion-icon name="search-outline"></ion-icon>
        {/* <Text d={{base:"none" ,md:"flex"}} px="1" pb="1">search user</Text> */}
    </Button>
    </Tooltip>
    <Text fontSize="2xl" fontFamily="Bodoni Moda" color="white">CHAT-MATE</Text>
    <div>
        <Menu>
                <Tooltip label="Notifications" hasArrow placement='bottom-end' bg="white" color="black">
            <MenuButton p={1}>
                <BellIcon fontSize="2xl" m={1} color="white"/>
            </MenuButton>
                </Tooltip>
            {/* <MenuList></MenuList> */}
        </Menu>

            <Menu>
               <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
               <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
               </MenuButton>
               <MenuList>
                <MenuItem>My Profile</MenuItem>
                <MenuDivider/>
                <MenuItem>Logout</MenuItem>
               </MenuList>
            </Menu>
    </div>
   </Box>
   </>
  )
}

export default SideDrawer