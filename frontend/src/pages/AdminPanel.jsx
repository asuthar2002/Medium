import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Avatar, Stack, TablePagination, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import getImageUrl from '../utils/getImageUrl';
import axios from 'axios';

export default function AdminPanel() {
  const [stats, setStats] = useState({ userCount: 0, postCount: 0, suspendedCount: 0 });
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearch(search); }, 700);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchUsers(page + 1, rowsPerPage, debouncedSearch);
    fetchStats();
  }, [user, page, rowsPerPage, debouncedSearch]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://localhost:5000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
      setStats(res.data);
    } catch (err) {
      console.log(err)
    }
  };

  const fetchUsers = async (page, pageSize, searchValue = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(`http://localhost:5000/api/users?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(searchValue)}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setUsers(res.data.users);
      setTotal(res.data.total);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, withCredentials: true
      });
      fetchUsers(page + 1, rowsPerPage);
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleSuspend = async (id) => {
    if (!window.confirm('Suspend this user?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(`http://localhost:5000/api/users/${id}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }, withCredentials: true
      });
      fetchUsers(page + 1, rowsPerPage, search);
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to suspend user');
    }
  };

  const handleUnsuspend = async (id) => {
    if (!window.confirm('Unsuspend this user?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(`http://localhost:5000/api/users/${id}/unsuspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }, withCredentials: true
      });
      fetchUsers(page + 1, rowsPerPage, search);
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unsuspend user');
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Admin Panel - Users</Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Dashboard Overview</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'primary.light', color: 'primary.contrastText', minHeight: 100 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                <span role="img" aria-label="users">👥</span>
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Total Users</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.userCount}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'success.light', color: 'success.contrastText', minHeight: 100 }}>
              <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                <span role="img" aria-label="posts">📝</span>
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Total Posts</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.postCount}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'warning.light', color: 'warning.contrastText', minHeight: 100 }}>
              <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                <span role="img" aria-label="suspended">⛔</span>
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Suspended Users</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.suspendedCount}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search by email"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          size="small"
          fullWidth
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id}>
                <TableCell><Avatar src={getImageUrl(u.profileImage)} alt={u.email} /></TableCell>
                <TableCell>{u.firstName || ''} {u.lastName || ''}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" size="small" onClick={() => { setSelectedUser(u); setDetailsOpen(true); }}>
                      View Details
                    </Button>
                    {u.id !== user.id && (
                      u.isSuspended ? (
                        <Button variant="contained" color="warning" size="small" onClick={() => handleUnsuspend(u.id)}>
                          Unsuspend
                        </Button>
                      ) : (
                        <Button variant="contained" color="secondary" size="small" onClick={() => handleSuspend(u.id)}>
                          Suspend
                        </Button>
                      )
                    )}
                    {u.id !== user.id && (
                      <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(u.id)}>
                        Delete
                      </Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </TableContainer>
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ minWidth: 300 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar src={getImageUrl(selectedUser.profileImage)} alt={selectedUser.email} sx={{ width: 56, height: 56 }} />
                <Typography variant="h6">{selectedUser.firstName} {selectedUser.lastName}</Typography>
              </Stack>
              <Typography><b>Email:</b> {selectedUser.email}</Typography>
              <Typography><b>Role:</b> {selectedUser.role}</Typography>
              <Typography><b>Created At:</b> {new Date(selectedUser.createdAt).toLocaleString()}</Typography>
              <Typography><b>Email Verified:</b> {selectedUser.isEmailVerified ? 'Yes' : 'No'}</Typography>
              <Typography><b>ID:</b> {selectedUser.id}</Typography>
              <Typography><b>Suspended:</b> {selectedUser.isSuspended ? 'Yes' : 'No'}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
