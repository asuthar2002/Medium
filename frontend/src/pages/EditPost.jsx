import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostForm from '../components/PostForm';
import { updatePost, fetchMyPosts } from '../features/post/postThunk'
import { useNavigate, useParams } from 'react-router-dom';

export default function EditPostPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { posts, loading } = useSelector(state => state.posts);

    const post = posts.find(p => p.id === parseInt(id));
    useEffect(() => {
        if (!post) dispatch(fetchMyPosts());
    }, [dispatch, post]);

    const handleUpdate = async data => {
        const result = await dispatch(updatePost({ id, data }));
        if (!result.error) navigate('/');
    };

    if (!post) return <div>Loading...</div>;

    return <PostForm onSubmit={handleUpdate} defaultValues={post} loading={loading} />;
}
