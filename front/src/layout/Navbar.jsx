import React, { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Button, InputBase, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import { useSearch } from '../context/SearchContext';  // Import the useSearch hook
import { useAuth } from '../context/Context';  // Import the useAuth hook

// Styled components for Search
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function Navbar() {
  const { updateSearch } = useSearch();  
  const { isLoggedIn, isAdmin } = useAuth();  // Access isAdmin and isLoggedIn from AuthContext
  const [drawerOpen, setDrawerOpen] = useState(false);


  console.log(isLoggedIn, isAdmin);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);  // Toggle the drawer
  };

  const handleSearchChange = (e) => {
    updateSearch(e.target.value);  // Update search query in context
  };

  // Handle navigation using window.location.href
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#400440d4' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}  // Show only on small screens
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>

            {/* Brand logo */}
            <Button color="inherit" onClick={() => handleNavigation('/')}>
              Home
            </Button>
            <Button color="inherit" onClick={() => handleNavigation('/about')}>
              About
            </Button>
            {isLoggedIn && (
              <Button color="inherit" onClick={() => handleNavigation('/my-bookings')}>
                My Bookings
              </Button>
            )}
            {isLoggedIn && (
              <Button color="inherit" onClick={() => handleNavigation('/saved-flights')}>
                Saved Flights
              </Button>
            )}
            <Button color="inherit" onClick={() => handleNavigation('/contact')}>
              Contact
            </Button>
            {isAdmin && (
              <Button color="inherit" onClick={() => handleNavigation('/bookings')}>
                All Bookings
              </Button>
            )}
          </Box>

          {/* Right side: Search bar */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleSearchChange}  // Connect the search input to the context
              />
            </Search>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile navigation */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
        <Box sx={{ width: 250, padding: 2 }}>
          <Button color="inherit" fullWidth onClick={() => handleNavigation('/')}>
            Home
          </Button>
          <Button color="inherit" fullWidth onClick={() => handleNavigation('/about')}>
            About
          </Button>
          {isLoggedIn && (
            <Button color="inherit" fullWidth onClick={() => handleNavigation('/my-bookings')}>
              My Bookings
            </Button>
          )}
          {isLoggedIn && (
            <Button color="inherit" fullWidth onClick={() => handleNavigation('/saved-flights')}>
              Saved Flights
            </Button>
          )}
          <Button color="inherit" fullWidth onClick={() => handleNavigation('/contact')}>
            Contact
          </Button>
          {isAdmin && (
            <Button color="inherit" fullWidth onClick={() => handleNavigation('/bookings')}>
              All Bookings
            </Button>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
