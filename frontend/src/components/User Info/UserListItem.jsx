import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatProvider";
import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({user, handleFunction }) => {

  return (
    <div style={{width:"100%"}}>
      <Box
        onClick={handleFunction}
        cursor="pointer"
        bg="#E8E8E8"
        _hover={{
          background: "#38B2AC",
          color: "white",
        }}
       
        display="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        mt={4}
        borderRadius="lg"
      >
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={user.name}
          src={user.pic}
        />
        <Box>
          <Text>{user.name}</Text>
          <Text fontSize="xs">
            <b>Email : </b>
            {user.email}
          </Text>
        </Box>
      </Box>
    </div>
  );
};

export default UserListItem;
