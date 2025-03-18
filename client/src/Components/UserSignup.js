import { InputLabel, Divider, OutlinedInput, FormControl, FormHelperText, Button } from '@mui/material'
import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import sigValidation from './SigValidation'
import axios from 'axios';
import '../style/loginStyle.css'
import { PreloaderContext } from "./preLoaderContext";
function UserSignup() {
  const { setLoading } = useContext(PreloaderContext);
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    user: "signup"
  })
  const navigate = useNavigate()
  const handleInput = (event) => {
    setValues(prev =>({...prev, [event.target.name] : event.target.value}))
  }
  const className = {
    container:"d-flex mb-3 justify-content-center align-items-center",
    background: "bg-image"
 }
  const [errors, setError] = useState({})
  const handleSubmit = (event) => {
    event.preventDefault()
    setError(sigValidation(values))
    if (errors.name === "" && errors.email === "" && errors.password === ""){
      setLoading(true)
      axios.post('http://localhost:14853/api/signup', values)
      .then((res)=>{
        if (res.data.message === "User signup successfully")  {
           setTimeout(() => {
            setLoading(false)
             navigate('/Login')
           }, 2000);
        }})
      .catch((err)=>{if (err.message){setTimeout(()=>{setLoading(false);alert('This account already exists.')})}})
    }
  }
  return (
    <div className={`${className.container} ${className.background}`}>
        <div className='bg-white p-3 rounded w-25'>
          <form action="" onSubmit={handleSubmit}>
            <h2 className='text-center mb-4'>𝕴𝖓𝖘𝖕𝖎𝖗𝖊 𝕸𝖊</h2>
            <div className='mb-3'>
                <FormControl fullWidth variant = "outlined">
                   <InputLabel htmlFor= "name">Name</InputLabel>
                   <OutlinedInput id="Name" placeholder='Enter your name' onChange={handleInput} type="name" label="Name" name='name'/>
                   {errors.name && <FormHelperText sx={{ textAlign: "left", ml: 0 }}>{errors.name}</FormHelperText>}
                </FormControl>
            </div>
            <div className="mb-3">
                <FormControl fullWidth variant="outlined">
                   <InputLabel htmlFor="email">Email</InputLabel>
                   <OutlinedInput id="email" placeholder='Enter your email' onChange={handleInput} type="email" label="Email" name='email'/>
                   {errors.email && <FormHelperText sx={{ textAlign: "left", ml: 0 }}>{errors.email}</FormHelperText>}
                </FormControl>
              </div>
              <div className='mb-3'>
                <FormControl fullWidth variant='outlined'>
                   <InputLabel htmlFor="password">password</InputLabel>
                   <OutlinedInput id='password' placeholder='Enter your password' onChange={handleInput} type="password" label="password" name='password'/>
                   {errors.password && <FormHelperText sx={{ textAlign: "left", ml: 0 }}>{errors.password}</FormHelperText>}
                </FormControl>
              </div>
              <div className='mb-2'>
                <Button variant='contained' type="submit" fullWidth sx={{textTransform: "none"}}>Signup</Button>
              </div>
              <div className='mb-2'>
                  <p className='text-center small text-muter'>Already have an account? <Link to={"/Login"} style={{textDecoration: "none"}}>Login</Link></p>
              </div>
              <div className='mb-2'>
                  <Divider sx={{my: 2}}>OR</Divider>
              </div>
              <div className='mb-3'>
                 <Button variant="contained" fullWidth sx={{textTransform:"none"}}><i className='bi bi-facebook me-2 fs-5 fw-bold'></i>Login with Facebook</Button>
              </div>
              <div className='mb-2'>
                 <Button variant='outlined' sx={{textTransform: "none"}} fullWidth><i className='bi bi-google me-2 fs-5' style={{background: 'linear-gradient(to right, #4285F4, #EA4335, #FBBC05, #34A853)','-webkit-background-clip': 'text',color: 'transparent'}}></i>Login with Google</Button>
              </div>
          </form>
        </div>
    </div>
  )
}

export default UserSignup