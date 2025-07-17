import { Box, Button, Divider, Stack, TextField, Typography, Paper, useTheme, useMediaQuery, InputAdornment, IconButton, CircularProgress, } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authThunk";
import { setUserFromToken } from "../features/auth/authSlice";

export default function Login() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Handle Google OAuth token from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('accessToken', token);
            dispatch(setUserFromToken(token));
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const { loading, error, user } = useSelector((state) => state.auth);
    const { register, handleSubmit, formState: { errors }, } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);
    const onSubmit = async (data) => {
        const result = await dispatch(loginUser(data));

        const from = location.state?.from?.pathname || "/";
        if (loginUser.fulfilled.match(result)) navigate(from, { replace: true });
    };

    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="calc(100vh - 64px)" px={2} bgcolor="#f9f9f9">
            <Paper elevation={3} sx={{ p: isMobile ? 3 : 4, width: isMobile ? "100%" : 400, borderRadius: 3, }} >
                <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
                    Welcome Back 👋
                </Typography>
                <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
                    Login to continue
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={2}>
                        <TextField label="Email" type="email" fullWidth variant="outlined"      {...register("email", { required: "Email is required" })} error={Boolean(errors.email)} helperText={errors.email?.message} />

                        <TextField label="Password" type={showPassword ? "text" : "password"} fullWidth variant="outlined"  {...register("password", { required: "Password is required" })} error={Boolean(errors.password)} helperText={errors.password?.message}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" aria-label="toggle password visibility" >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        {error && (
                            <Typography color="error" variant="body2" textAlign="center">
                                {typeof error === "string" ? error : "Login failed"}
                            </Typography>
                        )}

                        <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 1 }} disabled={loading} startIcon={loading && <CircularProgress size={20} />}   >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </Stack>
                </form>

                <Divider sx={{ my: 3 }}>OR</Divider>

                <Button variant="outlined" fullWidth size="large" onClick={handleGoogleLogin} startIcon={<GoogleIcon />}  >
                    Continue with Google
                </Button>

                <Typography variant="body2" align="center" mt={3}>
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" style={{ textDecoration: "none", color: theme.palette.primary.main }}>
                        Sign Up
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}
