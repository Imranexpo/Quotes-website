import {Button, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Popover } from "bootstrap";
import '../style/loginStyle.css'
import axios from "axios";
import InfoIcon from '@mui/icons-material/Info';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

function ForgotPassword () {
  const [email, setEmail] = useState()
  const navigate = useNavigate();
  const handlesubmit = (event) => {
    event.preventDefault();
      axios.post('http://localhost:14853/api/Forgot-password', {email})
      .then((res)=>{
       if(res.data.message === "success") {
         navigate('/')
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
            <div className="text-center">
            <div className="mb-2 fs-5 d-inline-block" tabIndex={0} data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="𝖤𝗇𝗍𝖾𝗋 𝗒𝗈𝗎𝗋 𝖤𝗆𝖺𝗂𝗅 Please">
            <InfoIcon/>
            </div>
             </div>
              <h2 className="text-center mb-3">𝕴𝖓𝖘𝖕𝖎𝖗𝖊 𝕸𝖊</h2>
              <p className="text-center">𝖤𝗇𝗍𝖾𝗋 𝗒𝗈𝗎𝗋 𝖤𝗆𝖺𝗂𝗅 𝖺𝗇𝖽 𝗐𝖾'𝗅𝗅 𝗌𝖾𝗇𝖽 𝗒𝗈𝗎 𝖺 𝗅𝗂𝗇𝗄 𝗍𝗈 𝗋𝖾𝗌𝖾𝗍 𝗒𝗈𝗎𝗋 𝗉𝖺𝗌𝗌𝗐𝗈𝗋𝖽</p>
              <div className="mb-3">
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <OutlinedInput id="email" placeholder="Enter your Email" onChange={e=> setEmail(e.target.value)} type="email"label="Email" name="email"/>
                </FormControl>
              </div>
              <div className="mb-2">
              <Button variant="contained" type="submit" fullWidth sx={{textTransform: "none"}}>Send</Button>
              </div>
              <div className="text-center">
                <Button variant="text" onClick={()=>navigate('/Login')}><ChevronLeftIcon style={{marginBottom: '3px'}}/>Back to Login</Button>
              </div>
           </form>
        </div>
      </div>
    )
}

export default ForgotPassword;