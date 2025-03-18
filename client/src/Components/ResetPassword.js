import {Button, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Popover } from "bootstrap";
import '../style/loginStyle.css'
import axios from "axios";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

function ResetPassword () {
  const [password, setPassword] = useState()
  const {id, token} = useParams();
  const navigate = useNavigate();
  const handlesubmit = (event) => {
    event.preventDefault();
      axios.put(`http://localhost:14853/api/reset_password/${id}/${token}`, {password})
      .then((res)=>{
       if(res.data.message === "success") {
        alert('Your password was reset successfully')
         navigate('/Login')
         } 
       }       
      )
      .catch((err)=>console.log(err.message))
  }
  const className = {
     container:"d-flex mb-3 justify-content-center align-items-center",
     background: "bg-image"
  }
  useEffect(() => {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    popoverTriggerList.forEach((popover) => new Popover(popover));
  }, []);
    return (
      <div className={`${className.container} ${className.background}`}>
        <div className="bg-white p-3 rounded w-25 shadow-lg">
           <form action="" onSubmit={handlesubmit}>
              <h2 className="text-center mb-3">𝕴𝖓𝖘𝖕𝖎𝖗𝖊 𝕸𝖊</h2>
              <p className="text-center">Reset your password</p>
              <div className="mb-3">
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="password">New password</InputLabel>
                  <OutlinedInput id="password" placeholder="Enter your password" onChange={e=> setPassword(e.target.value)} type="password" label="New password" name="password"/>
                </FormControl>
              </div>
              <div className="mb-2">
              <Button variant="contained" type="submit" fullWidth sx={{textTransform: "none"}}>Update</Button>
              </div>
              <div className="text-center">
                <Button variant="text" onClick={()=>navigate('/Login')}><ChevronLeftIcon style={{marginBottom: '3px'}}/>Back to Login</Button>
              </div>
           </form>
        </div>
      </div>
    )
}

export default ResetPassword;