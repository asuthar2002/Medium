import { Box, Button, Stack, TextField, Typography, Paper, InputAdornment, IconButton, Avatar, FormHelperText, } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../features/auth/authThunk";


export default function Signup() {

    const dispatch = useDispatch();
    const { loading, user } = useSelector((state) => state.auth);
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const [selectedFile, setSelectedFile] = useState(null);
    const [adminInviteCode, setAdminInviteCode] = useState("");

    const [imagePreview, setImagePreview] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };
    useEffect(() => {
        if (user) { navigate("/", { replace: true }); }
    }, [user, navigate]);
    const onSubmit = async (data) => {
        setErrorMsg("");
        setSuccessMsg("");

        if (data.password !== data.confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }

        const formData = new FormData();
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("confirmPassword", data.confirmPassword);
        formData.append("profileImage", selectedFile);
        if (adminInviteCode) formData.append("adminInviteCode", adminInviteCode);

        try {
            const result = await dispatch(signupUser(formData)).unwrap();
            if (result.status === "otp_resent" || result.status.includes("otp_resent") || result.status === "otp_sent" || result.status.includes("otp_sent")) {
                localStorage.setItem("emailToVerify", data.email);
                navigate("/verify-email");
            }
        } catch (err) {
            if (err.status === "exists_verified") navigate("/login")
            console.error("Signup failed:", err);
            setErrorMsg(err.message);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 64px)" px={2} bgcolor="#f5f5f5" >
            <Paper elevation={3} sx={{ p: 4, width: 400, maxWidth: "100%" }}>
                <Typography variant="h5" fontWeight={600} align="center" gutterBottom>
                    Create Account
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center" mb={3}>
                    Join us by creating your account
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    <Stack spacing={2}>
                        <TextField label="First Name"    {...register("firstName", { required: "First name is required" })} error={!!errors.firstName} helperText={errors.firstName?.message} fullWidth />

                        <TextField label="Last Name"    {...register("lastName", { required: "Last name is required" })} error={!!errors.lastName} helperText={errors.lastName?.message} fullWidth />

                        <TextField
                            label="Email"
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            fullWidth
                        />
                        <TextField label="Admin Invite Code (optional)" type="password" value={adminInviteCode} onChange={e => setAdminInviteCode(e.target.value)} fullWidth autoComplete="off" helperText="Leave blank unless you were given an admin invite code." />

                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Minimum 6 characters" },
                            })}
                            fullWidth
                            slots={{ input: OutlinedInput }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <TextField
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            {...register("confirmPassword", { required: "Confirm your password" })}
                            fullWidth
                            slots={{ input: OutlinedInput }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowConfirmPassword((p) => !p)} edge="end">
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <Button variant="outlined" component="label">
                            Upload Profile Image
                            <input hidden type="file" accept="image/*" onChange={(e) => { handleImageChange(e); setSelectedFile(e.target.files[0]); }} />
                        </Button>

                        {imagePreview && (<Avatar src={imagePreview} alt="Preview" sx={{ width: 80, height: 80, mx: "auto", my: 1 }} />)}

                        {errorMsg && (<FormHelperText error sx={{ textAlign: "center" }}>         {errorMsg}     </FormHelperText>)}
                        {successMsg && (<FormHelperText sx={{ textAlign: "center", color: "green" }}>        {successMsg}    </FormHelperText>)}

                        <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                            {loading ? "Submitting..." : "Sign Up"}
                        </Button>

                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}
