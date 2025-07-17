import { useDispatch, useSelector } from 'react-redux';
import PostForm from '../components/PostForm';
import { createPost } from '../features/post/postThunk';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function CreatePostPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector(state => state.posts);
    const handleCreate = async data => {
        const result = await dispatch(createPost(data));
        if (!result.error) navigate('/');
    };
    return (
        <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
            <Card sx={{ width: '100%', maxWidth: 500, boxShadow: 6 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AddCircleOutlineIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                        <Typography variant="h5" fontWeight={700}>Create a New Post</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Share your thoughts with the community. Fill in the details below and submit your post.
                    </Typography>
                    <PostForm onSubmit={handleCreate} loading={loading} />
                </CardContent>
            </Card>
        </Box>
    );
}
