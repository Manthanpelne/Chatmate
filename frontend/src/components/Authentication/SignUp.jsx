import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import StyledButton from '../Button';


export default function SignUp() {
    const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const [show, setShow] = useState(false)


  const handleClick=()=>{
    setShow(!show)
  }

  const postDetails=(pics)=>{

  }

  return (
    <div>
        <VStack spacing="5px">
        <FormControl id='first-name' isRequired>
            <FormLabel> Name </FormLabel>
                <Input placeholder='Enter Your Name' onChange={()=>setName(e.target.value)}/>
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel> Email </FormLabel>
                <Input placeholder='Enter Your Email' onChange={()=>setEmail(e.target.value)}/>
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel> Password </FormLabel>
            <InputGroup>
                <Input type={show?"text":"password"} placeholder='Enter New Password' onChange={()=>setPassword(e.target.value)}/>
                <InputRightElement width="4.5rem">
                 <Button h="1.75rem" size="sm" onClick={handleClick}>{show?"Hide":"Show"}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel> Confirm Password </FormLabel>
            <InputGroup>
                <Input type={show?"text":"password"} placeholder='Confirm Password' onChange={()=>setPassword(e.target.value)}/>
                <InputRightElement width="4.5rem">
                 <Button h="1.75rem" size="sm" onClick={handleClick}>{show?"Hide":"Show"}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='pic' isRequired>
            <FormLabel> Upload Your Image </FormLabel>
                <Input
                type='file'
                p={1.5}
                accept='image/*'
                 placeholder='Updoad Avatar' onChange={(e)=>postDetails(e.target.files[0])}/>
        </FormControl>

        <StyledButton text="Sign Up"/>
        </VStack>
    </div>
  )
}

