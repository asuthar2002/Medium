import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, Avatar, Typography, TextField, Paper, InputAdornment, CircularProgress, Alert, Divider, Stepper, Step, StepLabel, Modal, Snackbar } from '@mui/material';
import { useSnackbar } from 'notistack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import { updateProfile } from '../features/auth/authThunk';

function ForgotPasswordStepper({ open, onClose, email }) {
  const [activeStep, setActiveStep] = useState(0);
  const [inputEmail, setInputEmail] = useState(email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const steps = ['Enter Email', 'Verify OTP', 'Set New Password'];
  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    setTimeout(() => { setLoading(false); setActiveStep(1); }, 1200);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (otp === '123456') {
        setActiveStep(2);
        setLoading(false);
      } else {
        setLoading(false);
        setError('Invalid OTP');
      }
    }, 1200);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError('');
    if (!newPassword || !confirmNewPassword) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setActiveStep(0);
      setInputEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    }, 1200);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 6, maxWidth: 400, mx: 'auto', mt: '10vh', outline: 'none', position: 'relative' }}>
        <Typography variant="h6" align="center" mb={2}>Forgot Password</Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
          {steps.map(label => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
        </Stepper>

        {activeStep === 0 && (
          <Box>
            <TextField
              label="Email" type="email" fullWidth margin="normal" value={inputEmail} onChange={e => setInputEmail(e.target.value)} required />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSendOtp} disabled={loading || !inputEmail} >
              {loading ? <CircularProgress size={24} /> : 'Send OTP'}
            </Button>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <TextField label="OTP" type="text" fullWidth margin="normal" value={otp} onChange={e => setOtp(e.target.value)} required /> <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleVerifyOtp} disabled={loading || !otp} >
              {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <TextField label="New Password" type="password" fullWidth margin="normal" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            <TextField label="Confirm New Password" type="password" fullWidth margin="normal" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} required />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleResetPassword} disabled={loading || !newPassword || !confirmNewPassword} >
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
          <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Password reset successful!
          </Alert>
        </Snackbar>

        <Button onClick={onClose} color="secondary" sx={{ position: 'absolute', top: 8, right: 8, minWidth: 0 }}>✕ </Button>
      </Box>
    </Modal>
  );
}

const EditProfile = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { user, loading, error } = useSelector(state => state.auth);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const imagePreview = user?.profileImage ? `/uploads/${user.profileImage}` : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    const formData = new FormData();
    if (firstName && firstName !== user?.firstName) formData.append('firstName', firstName);
    if (lastName && lastName !== user?.lastName) formData.append('lastName', lastName);

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordError('Please fill all password fields.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError('New password and confirm password do not match.');
        return;
      }
      formData.append('currentPassword', currentPassword);
      formData.append('password', newPassword);
    }

    const result = await dispatch(updateProfile(formData));

    if (updateProfile.fulfilled.match(result)) {
      enqueueSnackbar('Profile updated successfully!', {
        variant: 'success',
        iconVariant: { success: <CheckCircleIcon /> },
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        autoHideDuration: 3500,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      enqueueSnackbar(result.payload || 'Profile update failed', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        autoHideDuration: 3500,
      });
    }
  };

  if (!user) return <Box p={4}><CircularProgress /></Box>;

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f8fafc">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, minWidth: 340, maxWidth: 400 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar src={imagePreview} alt={firstName} sx={{ width: 90, height: 90, mb: 1, border: '2px solid #e0e0e0' }} />
        </Box>
        <Typography variant="h5" fontWeight={700} align="center" mb={2} color="primary.dark">Edit Profile</Typography>

        <form onSubmit={handleSubmit}>
          <TextField label="First Name" fullWidth margin="normal" value={firstName} onChange={e => setFirstName(e.target.value)} required />

          <TextField label="Last Name" fullWidth margin="normal" value={lastName} onChange={e => setLastName(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EditIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            required
          />

          <TextField label="Email" fullWidth margin="normal" value={user?.email || ''} InputProps={{ readOnly: true }} sx={{ mb: 2 }} />

          <Divider sx={{ my: 2 }} />

          <TextField label="Current Password" type="password" fullWidth margin="normal" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          <TextField label="New Password" type="password" fullWidth margin="normal" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          <TextField label="Confirm New Password" type="password" fullWidth margin="normal" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          {passwordError && <Alert severity="error" sx={{ mt: 1 }}>{passwordError}</Alert>}

          <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button type="submit" variant="contained" color="primary" sx={{ px: 5, py: 1.2, fontWeight: 600, fontSize: '1.05rem', borderRadius: 2, boxShadow: 2, transition: 'all 0.2s' }} disabled={loading}>
              Save Changes
            </Button>
            {loading && (<CircularProgress size={28} sx={{ color: 'primary.main', position: 'absolute', top: '50%', left: '50%', marginTop: '-14px', marginLeft: '-14px' }} />)}
          </Box>
        </form>

        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="text" color="secondary" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '1rem', transition: 'color 0.2s', '&:hover': { color: 'primary.main', letterSpacing: 1 } }} onClick={() => setShowForgot(true)} >
            Forgot Password?
          </Button>
        </Box>
        <ForgotPasswordStepper open={showForgot} onClose={() => setShowForgot(false)} email={user?.email} />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Box>
  );
};

export default EditProfile;
