import { Box, Text, Container, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../components/Authentication/Login'
import SignUp from '../components/Authentication/SignUp'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"))
    if(user){
      navigate("/chat")
    }
  },[navigate])

  return (
    <div className='App'>
      
    <Container maxW="xl" centerContent>
    <div class="pyramid-loader">
  <div class="wrapper">
    <span class="side side1"></span>
    <span class="side side2"></span>
    <span class="side side3"></span>
    <span class="side side4"></span>
    <span class="shadow"></span>
  </div>
</div>
      <Box 
      display="flex"
      justifyContent="center"
      p={3}
      bg={"black"}
      w="100%"
      m="20px 0 0px 0"
      borderRadius="lg"
      textAlign="center"
      borderWidth="1px"
      >
        <Text fontSize="2xl" color="white">CHAT-MATE 
           </Text>
           
      </Box>

      {/* login signup form */}

      <Box bg="black" w="100%" color="white" p={4} borderRadius="lg" borderWidth="1px">
      <Tabs variant='soft-rounded' colorScheme='green'>
  <TabList mb="1em">
    <Tab color="white" width="50%">Login</Tab>
    <Tab color="white" width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <SignUp/>
    </TabPanel>
  </TabPanels>
</Tabs>
      </Box>

      </Container>
    </div>
  )
}

export default HomePage