import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import api from '../api/axios';

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/posts/${id}`)
      .then(res => {
        setPost(res.data.post || res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to load post');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!post) return <Typography>No post found.</Typography>;
  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate(-1)}>
        Back
      </Button>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>{post.heading}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            {new Date(post.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {post.content}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
