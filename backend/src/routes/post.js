import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getAllPosts, getMyPosts, createPost, updatePost, deletePost, getPostById } from '../controllers/postController.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/mine', authenticate, getMyPosts);
router.get('/:id', getPostById);
router.post('/', authenticate, createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;
