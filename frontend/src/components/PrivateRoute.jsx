import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

export default function PrivateRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
