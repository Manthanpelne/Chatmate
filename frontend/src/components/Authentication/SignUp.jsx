import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  position,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import StyledButton from "../Button";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function SignUp() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast()
  const navigate = useNavigate()

  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      return toast({
        title: "Please select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatmate");
      data.append("cloud_name", "dhoizlowp");
      fetch("https://api.cloudinary.com/v1_1/dhoizlowp/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data);
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setPicLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        colorScheme:"green",
        position: "top",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:4500/api/user",{
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      navigate("/chat");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setPicLoading(false);
    }
  };

  return (
    <div>
      <VStack spacing="5px">
        <FormControl id="first-name" isRequired>
          <FormLabel> Name </FormLabel>
          <Input
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel> Email </FormLabel>
          <Input
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel> Password </FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter New Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                colorScheme="purple"
                h="1.75rem"
                size="sm"
                onClick={handleClick}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel> Confirm Password </FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmpassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                colorScheme="purple"
                h="1.75rem"
                size="sm"
                onClick={handleClick}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="pic" isRequired>
          <FormLabel> Upload Your Image </FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            placeholder="Updoad Avatar"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>

        <Button
          colorScheme="blue"
          marginTop="5"
          width="100%"
          isLoading={picLoading}
          onClick={submitHandler}
        >
          Sign Up
        </Button>
        {/* <StyledButton text="Sign Up" isloading={picLoading}/> */}
      </VStack>
    </div>
  );
}
