import { createSlice } from '@reduxjs/toolkit';
import { createPost, updatePost, fetchMyPosts, fetchAllPosts } from './postThunk';

const postSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        allPosts: [],
        total: 0,
        page: 1,
        pageSize: 5,
        loading: false,
        error: null,
    },
    reducers: {
        resetPostState: state => {
            state.posts = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchMyPosts.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(fetchMyPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllPosts.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.allPosts = action.payload.posts;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.pageSize = action.payload.pageSize;
            })
            .addCase(fetchAllPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts.push(action.payload);
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                const idx = state.posts.findIndex(p => p.id === action.payload.id);
                if (idx !== -1) state.posts[idx] = action.payload;
            });
    },
});

export const { resetPostState } = postSlice.actions;
export default postSlice.reducer;
