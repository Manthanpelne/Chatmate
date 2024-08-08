import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatProvider'
import { Box, IconButton, Text } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'

const SingleChat = ({fetchMyChatAgain, setFetchMyChatAgain}) => {

    const {user, selectedChat, setSelectedChat} = useContext(ChatContext)

  return (
    <>
    {selectedChat? (
        <>
        <Text 
          fontSize={{ base: "22px", md: "26px" }}
          pb={3}
          px={2}
          w="100%"
          display="flex"
          justifyContent={{ base: "space-between" }}
          alignItems="center"
        >
      <IconButton display={{base:"flex", md:"none"}} icon={<ArrowBackIcon/>} onClick={()=>setSelectedChat("")}/>
        </Text>
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