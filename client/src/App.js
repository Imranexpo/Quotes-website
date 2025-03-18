import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState, useContext} from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from './Components/UserLogin';
import Signup from './Components/UserSignup';
import Homepage from './Components/Homepage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { PreloaderContext, PreloaderProvider } from "./Components/preLoaderContext";
import Typography from "@mui/material/Typography"; 
import './style/preLoader.css'
import { useTheme } from '@mui/material/styles'; 
function Preloader() {
  const { loading } = useContext(PreloaderContext);
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  if (!loading) return null; 
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.7)",
        zIndex: 9999,
      }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: primaryColor,
          boxShadow: "0px 0px 15px rgba(15, 187, 239, 0.49)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}>
        <CircularProgress size={25} thickness={5} sx={{ color: "#fff" }} />
      </Box>
      <Typography variant="h6" className="loading-text">
      𝕴𝖓𝖘𝖕𝖎𝖗𝖊 𝕸𝖊<span className="dots"></span>
      </Typography>
    </Box>
  );
}
function App() {
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);
  const handleLogin = (userId) => {
    localStorage.setItem('userId', userId);  
    setUserId(userId);
  };
  return (
    <PreloaderProvider>
    <BrowserRouter>
    <Preloader/>
    <Routes>
      <Route path='/' element={<Homepage userId={userId}/>}></Route>
      <Route path='/Login' element={<Login onLogin={handleLogin} />}></Route>
      <Route path='/Signup' element={<Signup />}></Route>
      <Route path='/Forgot-password' element={<ForgotPassword/>}></Route>
      <Route path='/reset_password/:id/:token' element={<ResetPassword/>}></Route>
    </Routes>
    </BrowserRouter>
    </PreloaderProvider>
  );
}

export default App;
