import { AppBar, Box, Divider, List, ListItem, ListItemText, Toolbar, Typography, Card, TextField, InputAdornment, Select, TableCell  } from '@mui/material'
import React, { useEffect, useState, useCallback, useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../style/loginStyle.css'
import Marquee from "react-fast-marquee";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from 'axios';
import $ from 'jquery';
import ModelCreate from './modelCreate';
import { useTheme } from '@mui/material/styles'; 
import { PreloaderContext } from './preLoaderContext';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Homepage({userId}) {
  const theme = useTheme();
  const { setLoading } = useContext(PreloaderContext);
  const primaryColor = theme.palette.primary.main;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [topics, setTopics] = useState([]);
  const [topicId, setTopicId] = useState();
  const [title, setTitle] = useState('');
  const [titleId, setTitleId] = useState('');
  const [columns, setColumns] = useState([]); 
  const isTopicClicked = useRef(false);
  const [content, setContent] = useState('');
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [filterOptions, setFilterOptions] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterValue, setFilterValue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSort = (columnId, columnName) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
    fetchRowsData(null, null, order, columnName)
  };
  const handleTopicClick = (id) => {
    setTopicId(null); 
    isTopicClicked.current = true;
    setTopicId(id);
  };
  useEffect(() => {
    if (topics.length > 0 && !isTopicClicked.current) {
      setTopicId(topics[0].id);  
    }
    isTopicClicked.current = false;
  }, [topics]);

  const handleSearch = () => {
    if (filterValue) {
      fetchRowsData(filterValue, searchQuery);
    } else {
      alert('please choose the filter')
    }
  };

  const handleClearFilter = () =>{
    setFilterValue(null);
    setSearchQuery('');
    fetchRowsData();
  }
  const fetchRowsData = useCallback((filterValue, searchQuery, ordered, columnName) => {
    if (userId && topicId) {
      setLoading(true)
      const user_id = userId ? Number(userId) : null;
      axios
        .post("http://localhost:14853/api/getUserData", { 
          user_id,
          topicId,
          page,
          pageSize,
          filteData: filterValue ? filterValue.label.replace(/\t/g, '') : '',
          searchData: searchQuery,
          order:ordered,
          ordered:columnName,
         })
        .then((res) => {
          if (res.data && res.data.rowsData) {
            setRowsData(res.data.rowsData);
            setTotalRecords(res.data.total);
            setTimeout(() => {
              setLoading(false)
            }, 1000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userId, topicId, page, pageSize, setLoading]); 
  const getTopics = useCallback(function() { 
    if (userId && !isTopicClicked.current) {
      axios.post('http://localhost:14853/api/userTopics', { userId })
      .then((res) => {
        setTopics(res.data.topics);
      })
      .catch((error) => {
        console.log(error);
      });
    }
    if (topicId) {
      const tableHeaderRow = $('#dynamicTable TableHead TableRow');
      tableHeaderRow.empty()
      axios.post('http://localhost:14853/api/Titles', { topicId })
      .then((res) => {
        setTitle(res.data.title)
        setTitleId(res.data.titleId)
        const newColumns = res.data.get_columns.filter(column => column.name && column.column_status === 1).map(column => ({id: column.id, name: column.name, sortable: column.sorting_status_id === 1, filterable: column.filter_status_id === 1}));
        setColumns(newColumns)
        const filterableColumns = newColumns.filter(column => column.filterable).map(column => ({label: column.name, id: column.id}))
        setFilterOptions(filterableColumns);
        if (res.data.content){
          setContent(res.data.content);
        } else {
          setContent('');
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [userId, topicId]);
  useEffect(() => {
    getTopics();
  }, [getTopics]); 

  useEffect(() => {
    fetchRowsData();
  }, [fetchRowsData]);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const menuId = 'primary-search-account-menu';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
        <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose} >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}><Link to={'/Login'} style={{textDecoration:"none", color:"black"}}>Logout</Link></MenuItem>
    </Menu>
  );
  return (
    <div>
   <Box sx={{ flexGrow: 1 }}>
  {/* HEADER BAR */}
    <AppBar position='static' sx={{ height: '52px' }}>
    <Toolbar sx={{ transform: 'translateY(-10%)' }}>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1}}>𝕴𝖓𝖘𝖕𝖎𝖗𝖊 𝕸𝖊</Typography>
        <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link to={'/'} style={{ textDecoration: "none", color: "white", fontSize: "15px", fontWeight: "bold" }}>
          HOME
        </Link>
        <Link to={'/'} style={{ textDecoration: "none", color: "white", fontSize: "15px", fontWeight: "bold" }}>
          QUOTES
        </Link>
        <Link to={'/'} style={{ textDecoration: "none", color: "white", fontSize: "15px", fontWeight: "bold" }}>
          AUTHORS
        </Link>
        </Box>
        <IconButton size="large" edge="end" aria-label="account of current user" aria-controls={menuId} aria-haspopup="true" onClick={handleProfileMenuOpen} color="inherit">
        <AccountCircle />
        </IconButton>
    </Toolbar>
    </AppBar>
    {renderMobileMenu}
    {renderMenu}
  </Box>
  {/* Marquee Area */}
  <Box sx={{ width: '100%', backgroundColor: '#f8f8f8', borderBottom: '1px solid #ddd' }}>
  <Marquee style={{ fontSize: '16px', padding: '4px 0' }}>
    <b style={{color: 'red'}}>Inspire Me:</b> &nbsp; Believe in yourself, and you will be unstoppable! ✨
    Every great journey begins with a single step, keep moving forward! 🚀 
    Your potential is limitless, dare to dream, dare to achieve! 💡
  </Marquee>
  </Box>
  {/* Sidebar + Main Content Layout */}
  <Box sx={{ display: 'flex', flexGrow: 1 , height: '90vh'}}>
  {/* Sidebar (for Desktop) */}
   <Box sx={{display: { xs: 'none', md: 'block', width: '300px', backgroundColor: '#f4f4f4', borderRight: '1px solid #ddd', overflowY: 'auto', maxHeight: '90vh'}}}>
       <Typography variant="h6" sx={{ p: 1, borderBottom: '1px solid #ddd' }}>𝐓𝐨𝐩𝐢𝐜𝐬</Typography>
       <Divider sx={{ borderColor: 'black'}}/>   
       <List>
       {topics.map((item, index) => (
       <React.Fragment key={item.id}>
       <ListItem button onClick={() => handleTopicClick(item.id)} className={topicId === item.id ? 'active' : '' }>
         <ListItemText id={`${item.id}`} primary={item.topic}/>
       </ListItem>
      {index < topics.length - 1 && <Divider />}
    </React.Fragment>
  ))}
</List>
   </Box>
   <Box sx={{ flexGrow: 1, padding: 1 }}>
          <Card sx={{ marginBottom: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 , color:'white', padding:'5px 10px',  backgroundColor:primaryColor }}>
              {title}
              </Typography>
              <Typography variant="body1" sx={{marginBottom: 1, paddingLeft:'10px'}}>
               {content}
              </Typography>
          </Card>
          <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <ModelCreate title={title} titleId={titleId} userId={userId} fetchRowsData={fetchRowsData}/>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Autocomplete 
            options={filterOptions}
            getOptionLabel={(option) => option.label}
            value={filterValue}
            onChange={(_, newValue) => setFilterValue(newValue)}
            disableClearable
             sx={{
               width: '180px',
               '& .MuiOutlinedInput-root': {
               height: '45px',
               paddingRight: '8px'
               },
               '& .MuiInputLabel-root': {
                fontSize: '14px',
                top: '-3px'
               }
             }} 
        renderInput={(params) => <TextField {...params} label="Filter By" />}/>
        <TextField variant="outlined" label="Search" size="small"
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           sx={{ 
               width: '280px',
               '& .MuiOutlinedInput-root': { 
               height: '45px', 
               paddingRight: '8px' 
           },
              '& .MuiInputLabel-root': {
              fontSize: '14px', 
              top: '5px'
           }
        }}
    InputProps={{
        endAdornment: (
          <InputAdornment position="end" sx={{ gap: '2px' }}>
              <IconButton size="small" onClick={handleSearch}
                  sx={{ 
                      bgcolor: 'lightblue', 
                      borderRadius: '50%', 
                      width: '24px', 
                      height: '24px', 
                      '&:hover': { bgcolor: 'turquoise' }
                  }} >
              <SearchIcon sx={{ fontSize: '16px', fontWeight: 'bold' }}/>
              </IconButton>
              <IconButton size="small" onClick={handleClearFilter}
                  sx={{ 
                      bgcolor: 'lightblue', 
                      borderRadius: '50%', 
                      width: '24px', 
                      height: '24px', 
                      '&:hover': { bgcolor: 'turquoise' }
                  }}>
                  <CloseIcon sx={{ fontSize: '16px', fontWeight: 'bold' }} />
              </IconButton>
          </InputAdornment>
        )
    }}
/>
</Box>
</Box>
      <TableContainer component={Paper} sx={{marginBottom: 5}}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead sx={{backgroundColo: "#ececec" }}>
        <TableRow> {columns.map((column) => (
        <TableCell key={column.id} sx={{ color: 'black', fontWeight: 'bold' }} sortDirection={orderBy === column.id ? order : false} >
        <TableSortLabel active={orderBy === column.id} direction={orderBy === column.id ? order : "asc"} IconComponent={column.sortable ? ArrowDropDownIcon : () => null}  onClick={(e) => {e.stopPropagation(); handleSort(column.id, column.name);}}   sx={{ color: 'black', pointerEvents: column.sortable ? 'auto' : 'none' }}>
        {column.name}
      </TableSortLabel>
      </TableCell>
      ))}
      </TableRow>
        </TableHead>
        <TableBody sx={{color: "#4C4C4A"}}>
        {rowsData.length > 0 ? (
            rowsData.map((row, index) => (
              <TableRow key={index} id={row.id}>
                <TableCell>{row.S_no}</TableCell>
                <TableCell>{row.quotes_title}</TableCell>
                <TableCell>{row.quotes_count}</TableCell>
                <TableCell>{row.author_name}</TableCell>
                <TableCell><EditCalendarIcon sx={{fontSize:'16px', color:'#1976d2', cursor:'pointer'}}/></TableCell>
                <TableCell><VisibilityIcon sx={{fontSize:'16px', color:'#1976d2', cursor:'pointer'}}/></TableCell>
                <TableCell>{row.created_at}</TableCell>
              </TableRow>
            ))) : (
              <TableRow>
                 <TableCell colSpan={7} align='start'>No records found</TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </TableContainer>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
   <Box sx={{display: 'flex'}}>
    <span>Showing <b>{rowsData.length > 0 ? (page - 1) * pageSize + 1 : 0}</b> to <b>{Math.min(page * pageSize, totalRecords)}</b> of <b>{totalRecords}</b> entries</span>
   </Box>
  {/* Pagination centered */}
  <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
    <Stack spacing={2}>
      <Pagination count={Math.ceil(totalRecords / pageSize)} page={page} onChange={(e, value)=> setPage(value)} shape="rounded" />
    </Stack>
  </Box>
  {/* Per page dropdown fixed to the right */}
  <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <span>Per page</span>
    <Select sx={{ minWidth: 80, height: 40 }} value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
      <MenuItem value={10}>10</MenuItem>
      <MenuItem value={15}>15</MenuItem>
      <MenuItem value={20}>20</MenuItem>
    </Select>
    </Box> 
    </Box>
    </Box>
  </Box>
  </div>
  )
}
export default Homepage