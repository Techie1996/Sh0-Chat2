import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack} from '@chakra-ui/react';
//import { set } from 'mongoose';
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from "axios";
import { useHistory } from 'react-router-dom';
const Login = () => {
     const[show,setShow] = useState(false);
     const[email,setEmail] = useState(); 
     const[password,setPassword] = useState(); 
     const [loading, setLoading] = useState(false);
     const handleClick =()=>setShow(!show);
     const toast = useToast();
     const history = useHistory();
      const submitHandler = async ()=> {
          setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
     console.log(email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        {
          email,
          password
        },
        config
      );
      //console.log(JSON.stringify(data));
      toast({
        title: "Login Succesfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
      };
  return (
    <VStack spacing="5" color="black">
    <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
                <Input placeholder="Enter Your Email"
                value={email}
                 onChange={(e)=>setEmail(e.target.value)}/>
     </FormControl>
     <FormControl id="password" isRequired>
        <FormLabel>password</FormLabel>
        <InputGroup>
                <Input
                type={show ? "show" : "password"} 
                 placeholder="Password"
                 value={password}
                 onChange={(e)=>setPassword(e.target.value)}/>
                 <InputRightElement>
                 <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "hide" : "show"}
                 </Button>
                 </InputRightElement>
        </InputGroup>
     </FormControl>
     <Button
     colorScheme="blue"
     width="100%"
     style={{ marginTop : 15 }}
     onClick={submitHandler}
     isLoading={loading}>
        Login
     </Button>
     <Button
     variant="solid"
     colorScheme="green"
     width="100%"
     onClick={()=>{
        setEmail("guest@example.com")
        setPassword("123456")
     }}>
        Get User Credentials
     </Button>
    </VStack>
  )
}

export default Login
