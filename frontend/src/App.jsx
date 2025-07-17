import Navbar from "./pages/Navbar";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { fetchUser } from "./features/auth/authThunk";
import { useDispatch } from "react-redux";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import CreatePostPage from "./pages/CreatePost";
import EditPostPage from "./pages/EditPost";
import HomePage from "./pages/Home";
import PostPage from "./pages/PostPage";
import MyPosts from "./pages/MyPosts";
import AdminPanel from "./pages/AdminPanel";
import EditProfile from "./pages/EditProfile";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import { useSelector } from "react-redux";
import { CircularProgress, Box } from "@mui/material";

export default function App() {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) { dispatch(fetchUser()); }
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', zIndex: 2000, }}>
        <CircularProgress size={54} color="primary" thickness={5} />
      </Box>
    );
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/create" element={<PrivateRoute><CreatePostPage /></PrivateRoute>} />
        <Route path="/edit/:id" element={<PrivateRoute><EditPostPage /></PrivateRoute>} />
        <Route path="/post/:id" element={<PrivateRoute><PostPage /></PrivateRoute>} />
        <Route path="/my-posts" element={<PrivateRoute><MyPosts /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      </Routes>
    </div>
  );
}
