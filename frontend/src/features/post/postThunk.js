import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchMyPosts = createAsyncThunk('posts/fetchMyPosts', async (_, thunkAPI) => {
    try {
        const res = await api.get('/posts/mine');
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
});

export const fetchAllPosts = createAsyncThunk('posts/fetchAllPosts', async ({ page = 1, pageSize = 5 }, thunkAPI) => {
    try {
        const res = await api.get(`/posts?page=${page}&pageSize=${pageSize}`);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
});

export const createPost = createAsyncThunk('posts/createPost', async (postData, thunkAPI) => {
    try {
        const res = await api.post('/posts', postData);
        return res.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
});

export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, data }, thunkAPI) => {
    try {
        const res = await api.put(`/posts/${id}`, data);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update post');
    }
});
export const deletePost = createAsyncThunk('posts/deletePost', async (id, thunkAPI) => {
    try {
        await api.delete(`/posts/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
});
