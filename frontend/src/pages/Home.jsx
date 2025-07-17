import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPosts } from '../features/post/postThunk';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    Stack,
    Pagination,
    Avatar,
} from '@mui/material';
import getImageUrl from '../utils/getImageUrl';

export default function HomePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { allPosts, loading, error, total, page: currentPage, pageSize } = useSelector(state => state.posts);
    const [page, setPage] = React.useState(1);

    useEffect(() => {
        dispatch(fetchAllPosts({ page, pageSize }));
    }, [dispatch, page, pageSize]);

    if (loading) return <CircularProgress sx={{ mt: 4 }} />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                All Posts
            </Typography>

            {Array.isArray(allPosts) && allPosts.length > 0 ? (
                allPosts.map(post => (
                    <Card key={post.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                <Avatar src={getImageUrl(post.user?.profileImage)} alt={post.user?.firstName || ""} sx={{ width: 32, height: 32 }} />
                                <Typography variant="subtitle2">
                                    {post.user ? `${post.user.firstName} ${post.user.lastName}` : "Unknown"}
                                </Typography>
                            </Stack>
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
                            </Stack>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography>No posts found</Typography>
            )}

            {total > pageSize && (
                <Pagination count={Math.ceil(total / pageSize)} page={page} onChange={(e, value) => setPage(value)} sx={{ mt: 3 }} />
            )}
        </Box>
    );
}
