import React, { useState, useContext, useRef } from 'react'
import Modal from '@mui/material/Modal';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import modelValidation from './ModelValidation';
import $ from 'jquery'
import axios from 'axios';
import { PreloaderContext } from "./preLoaderContext";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
const ModelCreate = (props) => {
    const { setRowsDatas } = props; // Destructuring props
    const { setLoading } = useContext(PreloaderContext);
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);
    const [isChecked, setIsChecked] = useState(false); 
    const [errors, setError] = useState({})
    const [values, setValues] = useState({firstName:'', lastName:'', titleName:'', textBox:'', userId: null });
    const [textAreas, setTextAreas] = useState([{ id: 0, value: "" }]); 
    const maxLength = 1000;
    const textAreasRef = useRef([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked); 
    };
    const closeModel = (event) => {
      event.preventDefault();
      resetValue();
    }
    const handleReset = () => {
         resetValue()
    }
    function resetValue() {
        setValues({firstName: '', lastName: '', titleName: '', textBox: ''});
        setError({});
        $('#first-name, #last-name, #title-names, #text-Box').val('');
        $('#first-name-helper-text, #last-name-helper-text, #title-name-helper-text, #error-textBox').text('');
        setTextAreas([{ id: 0, value: "" }])
    } 
    const handleInput = (event) => {
        setValues((prev) => ({
        ...prev,
        [event.target.name] : event.target.value, headerTitle: props.title, titleId: props.titleId, userId: props.userId ? Number(props.userId) : null
        }));
    };
      const handlesubmit = (event) => {
      event.preventDefault();
      setError(modelValidation(values))
      if (!$('#terms-checkbox').is(':checked')) {
        alert('Please check the all terms and conditions.')
      }
      if (!errors.firstName && !errors.lastName && !errors.titleName && !errors.textBox && $('#terms-checkbox').is(':checked')) {
        setLoading(true);
        axios.post('http://localhost:14853/api/modelCreate', values)
        .then((res) => {
          if (res.data.message) {
            setTimeout(() => {
              setLoading(false);
              alert(res.data.message); 
              setRowsDatas();
            }, 500);
          }
        })
        .catch((err)=>{if(err.message) {setTimeout(() => {setLoading(false)}, 2000);alert('All fields are required')}})
      }      
    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        border: 'inherit',
        boxShadow: 20,
        borderRadius: '5px',
        p: 2,
    };
    const addTextArea = () => {
      setTextAreas([...textAreas, {id: Date.now(), value: ""}]);
    };
    const removeTextArea = (id) => {
      const filteredTextAreas = textAreas.filter((textArea)=> textArea.id !== id);
      setTextAreas(filteredTextAreas.length > 0 ? filteredTextAreas : [{ id: 0, value: "" }]);
      setValues((prev) => ({
        ...prev,
        textBox: filteredTextAreas.map(textarea => textarea.value)
    }));
    if (currentIndex >= textAreas.length - 1) {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
    };
    const TextBoxInput = (index, event) => {
      const newTextAreas = [...textAreas];
      newTextAreas[index].value = event.target.value;
      setTextAreas(newTextAreas);
        setValues((prev) => ({
          ...prev,
          textBox: newTextAreas.map(textarea => textarea.value)
      }));
    };
    const handleNext = () => {
      if (currentIndex < textAreas.length - 1) { //ex currentindex 0 < 1
        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        textAreasRef.current[newIndex]?.focus();
      }
    }
    const handlePrev = () => {
      if (currentIndex > 0) {
        const newIndex = currentIndex - 1;
        setCurrentIndex(newIndex);
        textAreasRef.current[newIndex]?.focus();
      }
    }
    return (
    <div>
    <Button variant="contained" sx={{textTransform: 'none'}} onClick={handleOpen}>Create Now</Button>
    <Modal open={open}>
        <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontFamily: 'Interbold', fontWeight: 'bold', fontSize: 30 }}>Create Quotes</Typography>
            <IconButton size="small" sx={{ bgcolor: 'lightblue', borderRadius: '50%', width: '28px', height: '28px', '&:hover': { bgcolor: 'turquoise' }}} onClick={handleClose}>
             <CloseIcon onClick={closeModel} sx={{fontSize: '20px', fontWeight: 'bold'}}/>
            </IconButton>
            </Box>
            <form onSubmit={handlesubmit}>
            <Box sx={{ border: '2px solid #ccc', borderRadius: '4px', padding: '15px', marginTop: '12px', backgroundColor: '#ececec'}} >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', marginBottom: 1, gap: '16px', '& .MuiTextField-root': { width: 'calc(50% - 8px)' }}} noValidate  autoComplete="off">
            <Box sx={{ width: '100%', textAlign: 'start'}}>
                <Typography sx={{ fontSize: '15px', fontWeight: 'bold', marginBottom: "-10px", fontFamily:'Roboto", "Helvetica", "Arial", sans-serif' }}>Author Name</Typography>
            </Box>
            <TextField id="first-name" label="First Name" onChange={handleInput} name='firstName' variant="standard" helperText={errors.firstName} required/>
            <TextField id="last-name" label="Last Name" name='lastName' onChange={handleInput} variant="standard" helperText={errors.lastName} required/>
            <Box sx={{ width: '100%', textAlign: 'start'}}>
                <Typography sx={{ fontSize: '15px', fontWeight: 'bold', marginBottom: "-10px", fontFamily:'Roboto", "Helvetica", "Arial", sans-serif' }}>Quotes Title</Typography>
            </Box>
            <TextField id="title-names" label="Title Name" name='titleName' onChange={handleInput} variant="standard" helperText={errors.titleName} required/>
            {props.title && ( <TextField label="Header Name" variant="standard" defaultValue={props.title} disabled /> )}
            <Box sx={{ width: '100%', textAlign: 'start'}}>
                <Typography sx={{ fontSize: '15px', fontWeight: 'bold', fontFamily:'Roboto", "Helvetica", "Arial", sans-serif' }}>
                 Implement Your Quotes ({textAreas.length - 1 + 1})</Typography>
            </Box>
            <Box sx={{position:'relative', width:'100', overflowX: 'auto', display:'flex', gap: 2}}>
            {textAreas.map((textArea, index) => (
              <Box key={textArea.id} sx={{position: 'relative', minWidth:'636px'}}>
              <Box sx={{position:'absolute', top:'1px', right:'1px', padding: 1}}>
                 <IconButton sx={{p: 0, '&:hover': {bgcolor:'#e42021', color:'white'}}} onClick={addTextArea}>
                    <AddCircleIcon sx={{ fontSize:'30px'}}/>
                 </IconButton>
                 {textAreas.length > 1 && (
                  <IconButton sx={{p: 0, '&:hover': {bgcolor:'#00b400', color:'white'}}} onClick={() => removeTextArea(textArea.id)}>
                     <RemoveCircleIcon sx={{fontSize: '30px'}}/>
                  </IconButton>
                 )}
              </Box>
              <textarea 
                ref={(e1) => (textAreasRef.current[index] = e1)}
                style={{width: '100%', height:'130px'}}
                required 
                className='p-3 border border-blue-300 rounded resize-none overflow-y-auto' placeholder='Type Here...' name='textBox' value={textArea.value} onChange={(e) => TextBoxInput(index, e)}/>
                 <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "12px", fontFamily: 'Rob"Helvetica", "Arial", sans-serif' }}>
                      Characters ({textArea.value.length}/{maxLength})
                    </Typography>
              </Box>
              </Box>
            ))}
            </Box>
            </Box>
            <Box sx={{textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Tooltip title='Previous' placement="left">
                <IconButton size='small' sx={{bgcolor:'lightblue', borderRadius:'50%', width:'24px', height:'24px', '&:hover':{bgcolor:'#1976d2', color:'white'}}} onClick={handlePrev} disabled={currentIndex === 0}>
                  <NavigateBeforeIcon sx={{fontSize:'23px', fontWeight:'bold'}}/>
                </IconButton>
            </Tooltip>  
            <Box sx={{width:'10px'}}/>  
            <Tooltip title='Next' placement="right">
                <IconButton size='small' sx={{bgcolor: 'lightblue', borderRadius:'50%', width:'24px', height:'24px', '&:hover': {bgcolor:'#1976d2', color:'white'}}} onClick={handleNext} disabled={currentIndex === textAreas.length - 1}>
                 <NavigateNextIcon sx={{fontSize:'23px', fontWeight:'bold'}}/>
                </IconButton>
            </Tooltip>    
            </Box>
            <Box sx={{ width: '100%', textAlign: 'start', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '12px' }}>
             <FormControlLabel control={ <Checkbox checked={isChecked} id="terms-checkbox" onChange={handleCheckboxChange} name="terms" color="primary"/>}
                label={<Typography sx={{ fontSize: '15px', fontWeight: 'bold', fontFamily:'Roboto", "Helvetica", "Arial", sans-serif' }}> I agree to the <a href="/terms" target="_blank" style={{ textDecoration: 'none' }}>Terms and Conditions</a></Typography>}/>
                <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" sx={{textTransform: 'none',}} onClick={handleReset}>Reset</Button>
                <Button variant="contained" type='submit' sx={{textTransform: 'none', backgroundColor: 'green'}}>Save</Button>
                </Box>
            </Box>
       </Box>
      </form>
    </Box>
    </Modal>
    </div>
    )
}
export default ModelCreate;
