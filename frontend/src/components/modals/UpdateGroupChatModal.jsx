import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { ChatContext } from '../../context/ChatProvider';
import UserBadgeItem from '../User Info/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../User Info/UserListItem';


const UpdateGroupChatModal = ({fetchMyChatAgain, setFetchMyChatAgain, fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);

    const toast = useToast()

    const { selectedChat, setSelectedChat, user } = useContext(ChatContext)

    const handleSearch = async (query) => {
      setSearch(query);
      if (!query) {
        return;
      }
  
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`https://chatmate-3z3z.onrender.com/api/user?search=${search}`, config);
        console.log(data);
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
      }
    };
  
    const handleRename = async () => {
      if (!groupChatName) return;
  
      try {
        setRenameLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          `https://chatmate-3z3z.onrender.com/api/chat/rename`,
          {
            chatId: selectedChat._id,
            chatName: groupChatName,
          },
          config
        );
  
        console.log(data._id);
        // setSelectedChat("");
        setSelectedChat(data);
        setFetchMyChatAgain(!fetchMyChatAgain);
        setRenameLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setRenameLoading(false);
      }
      setGroupChatName("");
    };
  
    const handleAddUser = async (user1) => {
      if (selectedChat.users.find((u) => u._id === user1._id)) {
        toast({
          title: "User Already in group!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      if (selectedChat.groupAdmin._id !== user._id) {
        return toast({
          title: "Only admins can add someone!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        
      }
  
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          `https://chatmate-3z3z.onrender.com/api/chat/addToGroup`,
          {
            chatId: selectedChat._id,
            userId: user1._id,
          },
          config
        );
  
        setSelectedChat(data);
        setFetchMyChatAgain(!fetchMyChatAgain);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
      }
      setGroupChatName("");
    };
  
    const handleRemove = async (user1) => {
      if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
        toast({
          title: "Only admins can remove someone!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          `https://chatmate-3z3z.onrender.com/api/chat/removeFromGroup`,
          {
            chatId: selectedChat._id,
            userId: user1._id,
          },
          config
        );
  
        user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
        setFetchMyChatAgain(!fetchMyChatAgain);
        fetchMessages();
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
      setGroupChatName("");
    };
  

  return (
    <>
    <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}>Open Modal</IconButton>
    <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="24px" display="flex" justifyContent="center">{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
                
                {selectedChat.users.map((u)=>(
                    <UserBadgeItem key={u._id} user={u} admin={selectedChat.groupAdmin} handleFunction={()=>handleRemove(u)}/>
                ))}
            </Box>
            <FormControl display="flex" pb="15px">
                <Input 
               placeholder='Chat Name'
               value={groupChatName} 
               onChange={(e)=>setGroupChatName(e.target.value)}
                />
                <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
              </FormControl>
             
             <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
             </FormControl>
        

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((u) => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleAddUser(u)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' onClick={()=>handleRemove(user)}>
                Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal