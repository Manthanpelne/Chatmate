import React, { useContext } from 'react'
import ScrollableFeed from "react-scrollable-feed"
import { ChatContext } from '../context/ChatProvider'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from './GetSender'
import { Avatar, Text, Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({messages}) => {

    const {user}= useContext(ChatContext)

  return (
    <ScrollableFeed>
    {messages &&
      messages.map((m, i) => (
        <div style={{ display: "flex" }} key={m._id}>
          {(isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name}
                src={m.sender.pic}
              />
            </Tooltip>
          )}
          <span
            style={{
                color:"black",
              backgroundColor: `${
                m.sender._id === user._id ? "#BEE3F8" : "#e0f990"
              }`,
              marginLeft: isSameSenderMargin(messages, m, i, user._id),
              marginTop: isSameUser(messages, m, i, user._id) ? 4 : 9,
              borderRadius: "7px",
              padding: "5px 10px 10px 12px",
              maxWidth: "75%",
            }}
          >
            <Text fontWeight={400} color="black" fontSize={{ base: "12px", md: "14px" }}>
            {m.content}
            </Text>
          </span>
        </div>
      ))}
  </ScrollableFeed>
);
}

export default ScrollableChat