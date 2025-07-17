
import { createSlice } from "@reduxjs/toolkit";
import { fetchUser, loginUser, signupUser, verifyOtp, updateProfile } from "./authThunk";
import * as jwt_decode from "jwt-decode";
const initialState = { user: null, loading: false, role: null, error: null, emailToVerify: null, isEmailVerified: false, };


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserFromToken: (state, action) => {
            const token = action.payload;
            try {
                const user = jwt_decode(token);
                state.user = user;
            } catch {
                state.user = null;
            }
        },
        setEmailToVerify: (state, action) => {
            state.emailToVerify = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.loading = false;
            localStorage.clear();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { ...state.user, ...action.payload };
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                const token = action.payload.accessToken;
                localStorage.setItem("accessToken", token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.emailToVerify = action.payload.email;
                localStorage.setItem("accessToken", action.payload.accessToken);
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isEmailVerified = true;
            })
            //for fetching user Data
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.payload?.message || "Failed to fetch user";
            });
    },
});

export const { logout, setUserFromToken } = authSlice.actions;
export default authSlice.reducer;
