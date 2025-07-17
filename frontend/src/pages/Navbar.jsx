// src/components/Navbar.jsx
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Stack, CircularProgress } from '@mui/material';
import getImageUrl from '../utils/getImageUrl';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

import { Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';

export default function Navbar() {
    const { user, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <AppBar position="static" color="primary" elevation={2}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
                <Typography variant="h6" component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'white', fontWeight: 600 }} >
                    MyApp
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center">

                    {!user ? (
                        <>
                            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                            <Button color="inherit" component={RouterLink} to="/signup">Signup</Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={RouterLink} to="/">
                                All Posts
                            </Button>
                            <Button color="inherit" component={RouterLink} to="/create">
                                Create Post
                            </Button>
                            <Button color="inherit" component={RouterLink} to="/my-posts">
                                My Posts
                            </Button>
                            {user.role === 'admin' && (
                                <Button color="secondary" variant="contained" component={RouterLink} to="/admin">
                                    Admin Panel
                                </Button>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <Avatar alt={user.firstName} src={getImageUrl(user.profileImage)} sx={{ width: 32, height: 32, bgcolor: 'secondary.main', mr: 1 }} onClick={handleMenuOpen} />
                                <Typography variant="body1" sx={{ color: 'white', mr: 1 }} onClick={handleMenuOpen}   >
                                    {user.firstName}
                                </Typography>
                            </Box>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}    >
                                <MenuItem onClick={() => { handleMenuClose(); navigate('/edit-profile'); }}>Edit Profile</MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>Logout</MenuItem>
                            </Menu>
                        </>
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
