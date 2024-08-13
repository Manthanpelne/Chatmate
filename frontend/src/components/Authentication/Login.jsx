import React from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import StyledButton from '../Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [show, setShow] = useState(false)
  
    const toast = useToast()
    const navigate = useNavigate()
  
    const handleClick=()=>{
      setShow(!show)
    }

    const submitHandler=async()=>{

      if(!email || !password){
        toast({      
          title: "Please fill required fields",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top",
        })
        return
      }
   
     try {
      const config = {
        headers:{
          "Content-type":"application/json"
        }
      }

      const {data} = await axios.post("https://chatmate-3z3z.onrender.com/api/user/login",{
        email, password
      },
    config
    )
    toast({
      title: "Login Successful",
      status: "success",
      duration: 4000,
      isClosable: true,
      position: "top",
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
    navigate("/chat");

     } catch (error) {
      toast({
        title: "Invalid Email or Password",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
     }

    }
  
  
    return (
      <div>
          <VStack spacing="5px">
          <FormControl id='email' isRequired>
              <FormLabel> Email </FormLabel>
                  <Input type='email' value={email} placeholder='Enter Your Email' onChange={(e)=>setEmail(e.target.value)}/>
          </FormControl>
          <FormControl id='password' isRequired>
              <FormLabel> Password </FormLabel>
              <InputGroup>
                  <Input value={password} type={show?"text":"password"} placeholder='Enter New Password' onChange={(e)=>setPassword(e.target.value)}/>
                  <InputRightElement width="4.5rem">
                   <Button colorScheme='purple' h="1.75rem" size="sm" onClick={handleClick}>{show?"Hide":"Show"}</Button>
                  </InputRightElement>
              </InputGroup>
          </FormControl>
         
          <StyledButton text="Login" onClick={submitHandler}/>
          <Button
          variant="solid"
          colorScheme="red"
          width="100%"
          marginTop="10px"
          onClick={()=>{
            setEmail("guest@example.com")
            setPassword("guest@123")
          }}
          >Get Guest User Credentials</Button>
          </VStack>
      </div>
    )
}

export default Login