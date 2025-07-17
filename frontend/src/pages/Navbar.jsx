// src/components/Navbar.jsx
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Stack, CircularProgress } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { motion } from 'framer-motion';
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
        <AppBar
            position="static"
            sx={{
                background: '#1a237e',
                boxShadow: '0 2px 12px 0 rgba(26,35,126,0.12)'
            }}
            elevation={2}
            component={motion.div}
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        textDecoration: 'none',
                        color: 'white',
                        fontWeight: 700,
                        letterSpacing: 2,
                        fontSize: '1.5rem',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        transition: 'background 0.2s',
                        '&:hover': {
                            background: '#3949ab',
                        },
                    }}
                >
                    MyApp
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center">

                    {!user ? (
                        <>
                            <motion.div whileHover={{ scale: 1.06 }} transition={{ type: 'spring', stiffness: 300 }} style={{ display: 'inline-block' }}>
                                <Button
                                    variant="contained"
                                    component={RouterLink}
                                    to="/login"
                                    sx={{
                                        background: '#3949ab',
                                        color: 'white',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        px: 2.5,
                                        boxShadow: '0 2px 8px 0 rgba(26,35,126,0.18)',
                                        textTransform: 'none',
                                        '&:hover': {
                                            background: '#5c6bc0',
                                            boxShadow: '0 4px 16px 0 rgba(60,70,180,0.18)',
                                        },
                                    }}
                                >
                                    Login
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.06 }} transition={{ type: 'spring', stiffness: 300 }} style={{ display: 'inline-block' }}>
                                <Button
                                    variant="outlined"
                                    component={RouterLink}
                                    to="/signup"
                                    sx={{
                                        color: '#e8eaf6',
                                        borderColor: '#5c6bc0',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        px: 2.5,
                                        background: 'transparent',
                                        textTransform: 'none',
                                        '&:hover': {
                                            background: '#3949ab',
                                            color: 'white',
                                            borderColor: '#3949ab',
                                        },
                                    }}
                                >
                                    Signup
                                </Button>
                            </motion.div>
                        </>
                    ) : (
                        <>
                            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }} style={{ display: 'inline-block' }}>
                                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }} style={{ display: 'inline-block' }}>
                                    <Button
                                        variant="text"
                                        component={RouterLink}
                                        to="/"
                                        sx={{
                                            color: '#e8eaf6',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            px: 2.5,
                                            textTransform: 'none',
                                            '&:hover': {
                                                background: '#3949ab',
                                                color: 'white',
                                            },
                                        }}
                                    >
                                        All Posts
                                    </Button>
                                </motion.div>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }} style={{ display: 'inline-block' }}>
                                <motion.div whileHover={{ scale: 1.06 }} transition={{ type: 'spring', stiffness: 300 }} style={{ display: 'inline-block' }}>
                                    <Button
                                        variant="contained"
                                        component={RouterLink}
                                        to="/create"
                                        sx={{
                                            background: '#3949ab',
                                            color: 'white',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            px: 2.5,
                                            boxShadow: '0 2px 8px 0 rgba(26,35,126,0.18)',
                                            textTransform: 'none',
                                            '&:hover': {
                                                background: '#5c6bc0',
                                                boxShadow: '0 4px 16px 0 rgba(60,70,180,0.18)',
                                            },
                                        }}
                                    >
                                        Create Post
                                    </Button>
                                </motion.div>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }} style={{ display: 'inline-block' }}>
                                <motion.div whileHover={{ scale: 1.06 }} transition={{ type: 'spring', stiffness: 300 }} style={{ display: 'inline-block' }}>
                                    <Button
                                        variant="outlined"
                                        component={RouterLink}
                                        to="/my-posts"
                                        sx={{
                                            color: '#e8eaf6',
                                            borderColor: '#5c6bc0',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            px: 2.5,
                                            background: 'transparent',
                                            textTransform: 'none',
                                            '&:hover': {
                                                background: '#3949ab',
                                                color: 'white',
                                                borderColor: '#3949ab',
                                            },
                                        }}
                                    >
                                        My Posts
                                    </Button>
                                </motion.div>
                            </motion.div>
                            {user.role === 'admin' && (
                                <motion.div whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 300 }} style={{ display: 'inline-block' }}>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        component={RouterLink}
                                        to="/admin"
                                        startIcon={<AdminPanelSettingsIcon />}
                                        sx={{
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            mx: 0.5,
                                            px: 2,
                                            background: 'linear-gradient(90deg, #ff9800 40%, #f44336 100%)',
                                            color: 'white',
                                            '&:hover': {
                                                background: 'linear-gradient(90deg, #f57c00 40%, #c62828 100%)',
                                                boxShadow: 4,
                                            },
                                        }}
                                    >
                                        Admin Panel
                                    </Button>
                                </motion.div>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <Box component={motion.div} whileHover={{ scale: 1.15 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <Avatar alt={user.firstName} src={getImageUrl(user.profileImage)} sx={{ width: 32, height: 32, bgcolor: 'secondary.main', mr: 1 }} onClick={handleMenuOpen} />
                                </Box>
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
