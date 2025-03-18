import {Button, Divider, FormControl, InputLabel, OutlinedInput, FormHelperText } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useContext } from "react";
import validation from "./SigValidation";
import '../style/loginStyle.css'
import axios from "axios";
import { PreloaderContext } from "./preLoaderContext";

function LoginForm ({onLogin}) {
  const { setLoading } = useContext(PreloaderContext);
  const [values, setValues] = useState({
    email: '',
    password: '',
    user: 'login'
  })
  const navigate = useNavigate();
  const [errors, setError] = useState({})
  const handleInput = (event) => {
    setValues(prev =>({...prev, [event.target.name] : event.target.value}))
  }
  const handlesubmit = (event) => {
    event.preventDefault();
    setError(validation(values));
    if (errors.email === "" && errors.password === "") {  
      setLoading(true)
      axios.post('http://localhost:14853/api/login', values)
      .then((res)=>{ 
        onLogin(res.data.userId);
       if(res.data.message === "User login successfully") {
         setTimeout(() => {
          setLoading(false)
          navigate('/')
         },2000)
       }
      }       
      )
      .catch((err)=>{if (err.message){setTimeout(()=>{setLoading(false);alert("Invalid data Please try again.")},1000)}})
    }
  }
  const className = {
     container:"d-flex mb-3 justify-content-center align-items-center",
     background: "bg-image"
  }
    return (
      <div className={`${className.container} ${className.background}`}>
        <div className="bg-white p-3 rounded w-25 shadow-lg">
           <form action="" onSubmit={handlesubmit}>
              <h2 className="text-center mb-4">𝕴𝖓𝖘𝖕𝖎𝖗𝖊 𝕸𝖊</h2>
              <div className="mb-3">
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <OutlinedInput id="email" placeholder="Enter your Email" type="email" onChange={handleInput} label="Email" name="email"/>
                  {errors.email && <FormHelperText sx={{ textAlign: "left", ml: 0 }}>{errors.email}</FormHelperText>}
                </FormControl>
              </div>
              <div className="mb-2">
                <FormControl fullWidth variant="outlined">
                   <InputLabel htmlFor="password">Password</InputLabel>
                   <OutlinedInput id="password" placeholder="Enter your password" onChange={handleInput} type="password" label="password" name="password"/>
                   {errors.password && <FormHelperText sx={{ textAlign: "left", ml: 0 }}>{errors.password}</FormHelperText>}
                </FormControl>
              </div>
              <div className="mb-3">
                  <Link to={'/Forgot-password'} className="text-center small text-decoration-none">Forgot Password?</Link>
              </div>
              <div className="mb-2">
              <Button variant="contained" type="submit" fullWidth sx={{textTransform: "none"}}>Login</Button>
              </div>
               <div className="mb-2">
                <p className="text-center small text-muted">Don't have an account? <Link to={"/Signup"} style={{textDecoration: "none"}}>Signup</Link></p>
               </div>
               <div className="mb-2">
                    <Divider sx={{my: 2}}>OR</Divider>
               </div>
               <div className="mb-3">
                    <Button variant="contained" sx={{textTransform: "none"}} fullWidth><i className="bi bi-facebook me-2 fs-5 fw-bold"></i>Login with Facebook</Button>
               </div>
               <div className="mb-2">
                  <Button variant="outlined" sx={{textTransform: "none"}} fullWidth><i className="bi bi-google me-2 fs-5" style={{ background: 'linear-gradient(to right, #4285F4, #EA4335, #FBBC05, #34A853)','-webkit-background-clip': 'text',color: 'transparent'}} ></i>Login with Google</Button>
               </div>
           </form>
        </div>
      </div>
    )
}

export default LoginForm;