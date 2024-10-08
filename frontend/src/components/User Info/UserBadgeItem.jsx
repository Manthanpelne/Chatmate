import { CloseIcon } from '@chakra-ui/icons'
import { Badge, Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({handleFunction, user, admin}) => {
  console.log(user, "user")
  return (
  <Badge 
  
  px={2}
  py={1}
  borderRadius="lg"
  m={1}
  mb={2}
  variant="solid"
  fontSize={12}
  backgroundColor="purple"
  color="white"
  cursor="pointer"
  onClick={handleFunction}
  >
    {user.name+" "}
{admin._id === user._id && <span>(Admin)</span> }
 <CloseIcon pl={1}/>
  </Badge>
  )
}

export default UserBadgeItem