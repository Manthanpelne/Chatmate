import React from 'react'

const GetSender = (loggedUser, users) => {
 return users[0]?._id === loggedUser?._id? users[1].name : users[0].name
}

export default GetSender