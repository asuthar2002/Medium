
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const signupUser = createAsyncThunk("auth/signupUser", async (formData, { rejectWithValue }) => {
    try {
        const res = await axios.post("http://localhost:5000/api/auth/register", formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response?.data || { message: "Signup failed" });
    }
}
);


export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post("http://localhost:5000/api/auth/login", credentials,
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );

        const { accessToken } = response.data;
        console.log(response.data)
        return response.data;
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response?.data?.message || "Login failed");
    }
}
);
export const verifyOtp = createAsyncThunk("auth/verifyOtp", async ({ email, otp }, thunkAPI) => {
    try {
        const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp }, { withCredentials: true });
        return res.data?.user;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (formData, { rejectWithValue }) => {
    try {
        const res = await axios.put("http://localhost:5000/api/users/me", formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
            }
        );
        return res.data;
    } catch (err) {
        return rejectWithValue(
            err.response?.data?.message || "Profile update failed"
        );
    }
}
);

export const fetchUser = createAsyncThunk("auth/fetchUser", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get("http://localhost:5000/api/auth/fetchUser",
            {
                withCredentials: true, headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
        return res.data.user;
    } catch (err) {
        if (err.response?.status === 401) {
            try {
                const refreshRes = await axios.post(
                    "http://localhost:5000/api/auth/refresh-token",
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = refreshRes.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);

                const retryRes = await axios.get("http://localhost:5000/api/auth/fetchUser", {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`,
                    },
                });

                return retryRes.data.user;
            } catch (refreshErr) {
                localStorage.removeItem("accessToken");
                return rejectWithValue("Session expired");
            }
        }

        localStorage.removeItem("accessToken");
        return rejectWithValue("Not authenticated");
    }
}
);

