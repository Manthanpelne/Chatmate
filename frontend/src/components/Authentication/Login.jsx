import React from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import StyledButton from '../Button';

function Login() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
   
    const [show, setShow] = useState(false)
  
  
    const handleClick=()=>{
      setShow(!show)
    }

  const handleClickBtn=()=>{
        console.log("click")
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
         
          <StyledButton text="Login" onClick={handleClickBtn}/>
          <Button
          variant="solid"
          colorScheme="red"
          width="100%"
          marginTop="10px"
          onclick={()=>{
            setEmail("guest@example.com")
            setPassword("123456")
          }}
          >Get Guest User Credentials</Button>
          </VStack>
      </div>
    )
}

export default Login