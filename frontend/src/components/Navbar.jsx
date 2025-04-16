import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const navItems = [
    { text: 'Dashboard', path: '/dashboard' },
    { text: 'Devices', path: '/devices' },
    { text: 'Rooms', path: '/rooms' },
    { text: 'Energy Analytics', path: '/analytics' },
    { text: 'Settings', path: '/settings' },
  ];

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">HomeSync</Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <div style={{ width: 250 }}>
          <List>
            {navItems.map((item) => (
              <ListItem button component={Link} to={item.path} key={item.text} selected={location.pathname === item.path}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
