import { background, Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { ChatContext } from '../../context/ChatProvider';
import StyledButton from '../Button';
import axios from 'axios';
import Loader from '../Loader';
import UserListItem from '../User Info/UserListItem';
import UserBadgeItem from '../User Info/UserBadgeItem';

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast()

    const {user, chats, setChats} = useContext(ChatContext)
 
    const handleSearch=async(query)=>{
  setSearch(query)
  if(!query){
    return;
  }
  try {
    setLoading(true)
    const {data} = await axios.get(`http://localhost:4500/api/user?search=${search}`,{
      headers :{
        Authorization:`Bearer ${user.token}`
      }
    })
    //console.log(data)
    setLoading(false)
    setSearchResult(data)
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

    const handleSubmit=async()=>{
     if(!groupChatName || !selectedUsers){
      toast({
        title:"Please fill all the fields!",
        description:"Some fields are empty!",
        status:"warning",
        duration:"3000",
        isClosable:true,
        position:"top"
    })
    return;
     }
     try {
      const config = {
        headers :{
          Authorization:`Bearer ${user.token}`
        }
      };
      const {data} = await axios.post("http://localhost:4500/api/chat/group",{
        name:groupChatName,
        users:selectedUsers.map((u)=>u._id),
      },
     config
    );
        setChats([data,...chats])
      onClose()
      toast({
        title:"Created Groupchat successfully!",
        description:"Group Chat",
        status:"success",
        duration:"3000",
        isClosable:true,
        position:"top"
    })
    } catch (error) {
      toast({
        title:"Something went wrong",
        description:"Failed to make group",
        status:"error",
        duration:"3000",
        isClosable:true,
        position:"top"
    })
    }
    }

    
    const handleDelete=(delUser)=>{
   const deletedUser =  selectedUsers.filter((u)=>u._id!==delUser._id)
   setSelectedUsers(deletedUser)
  }


    const handleGroup=(userToAdd)=>{
      if(selectedUsers.includes(userToAdd)){
        toast({
          title:"User already added",
          description:"User already added in this group",
          status:"warning",
          duration:"3000",
          isClosable:true,
          position:"top"
      })
      return;
      }
      setSelectedUsers([...selectedUsers,userToAdd])
    }


  return (
   <>
     <span onClick={onOpen}>{children}</span>

<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader fontSize="22px" display="flex" justifyContent="center">Create Group Chat</ModalHeader>
    <ModalCloseButton />
    <ModalBody display="flex" flexDir="column" alignItems="center">
     <FormControl>
        <Input placeholder='Groupchat name...' mb={2} onChange={(e)=>setGroupChatName(e.target.value)}/>
     </FormControl>
     <FormControl>
        <Input placeholder='Add users...' mb={2} onChange={(e)=>handleSearch(e.target.value)}/>
     </FormControl>
      
      {/* selected users */}
      <Box w="100%" display="flex" flexWrap="wrap">
    {selectedUsers.map((u)=>(
      <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)}/>
    ))}
      </Box>

    {loading ? (
        <Loader/>
    ) : (
        searchResult?.map((user)=> <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>)
    )}

    </ModalBody>

    <ModalFooter>
    <StyledButton backgroundColor={"purple"} text="Create" onClick={handleSubmit}/>
    </ModalFooter>
  </ModalContent>
</Modal>
</>
  )
}

export default GroupChatModal