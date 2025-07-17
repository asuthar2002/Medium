import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyPosts, deletePost } from '../features/post/postThunk';
import { Box, Card, CardContent, Typography, Button, CircularProgress, Stack, Avatar } from '@mui/material';

export default function MyPosts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { posts, loading, error } = useSelector(state => state.posts);
    const [deletingId, setDeletingId] = React.useState(null);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        setDeletingId(id);
        try {
            await dispatch(deletePost(id)).unwrap();
            dispatch(fetchMyPosts());
        } catch (err) {
            alert(err);
        } finally {
            setDeletingId(null);
        }
    };
    useEffect(() => {
        dispatch(fetchMyPosts());
    }, [dispatch]);

    if (loading) return <CircularProgress sx={{ mt: 4 }} />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                My Posts
            </Typography>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => navigate('/create')}   >
                Create New Post
            </Button>
            {Array.isArray(posts) && posts.length > 0 ? (
                posts.map(post => (
                    <Card key={post.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6">{post.heading}</Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {post.content.length > 120 ? post.content.slice(0, 120) + '...' : post.content}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                {new Date(post.createdAt).toLocaleString()}
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Button variant="outlined" size="small" onClick={() => navigate(`/post/${post.id}`)}>
                                    Read More
                                </Button>
                                <Button variant="outlined" size="small" onClick={() => navigate(`/edit/${post.id}`)}>
                                    Edit
                                </Button>
                                <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(post.id)}>
                                    Delete
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography>No posts found</Typography>
            )}
        </Box>
    );
}
