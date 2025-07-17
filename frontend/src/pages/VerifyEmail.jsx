import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../features/auth/authThunk";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const VerifyEmail = () => {
    const dispatch = useDispatch();
    const reduxEmail = useSelector((state) => state.auth.emailToVerify);
    const emailToVerify = reduxEmail || localStorage.getItem("emailToVerify");
    const { error, loading } = useSelector((state) => state.auth);

    const [otp, setOtp] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleVerify = async () => {
        setErrorMsg("");
        try {
            await dispatch(verifyOtp({ email: emailToVerify, otp })).unwrap();
            localStorage.removeItem("emailToVerify");
            window.location.href = "/";
        } catch (err) {
            setErrorMsg(err.message || "Verification failed");
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 64px)" bgcolor="#f5f5f5" px={2}  >
            <Paper elevation={3} sx={{ p: 4, width: 400, maxWidth: "100%" }}>
                <Typography variant="h5" fontWeight={600} align="center" gutterBottom>
                    Verify Your Email
                </Typography>

                <Typography variant="body2" align="center" mb={2}>
                    We sent a 6-digit OTP to: <strong>{emailToVerify}</strong>
                </Typography>

                <Stack spacing={2}>
                    <TextField label="Enter OTP" variant="outlined" value={otp} onChange={(e) => setOtp(e.target.value)} fullWidth />

                    {errorMsg && (<Typography color="error" variant="body2" align="center">         {errorMsg}     </Typography>)}

                    <Button variant="contained" onClick={handleVerify} fullWidth size="large" disabled={loading || otp.length < 4} startIcon={loading ? <CircularProgress size={20} /> : null}>
                        {loading ? "Verifying..." : "Verify"}
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default VerifyEmail;
