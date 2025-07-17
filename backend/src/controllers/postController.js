import Post from '../models/post.js';
import User from '../models/user.js';


export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return res.status(400).json({ message: 'Invalid pagination parameters.' });
    }
    const search = req.query.search || '';
    if (typeof search !== 'string' || search.length > 100) {
      return res.status(400).json({ message: 'Invalid search parameter.' });
    }
    const where = search ? { heading: { [Post.sequelize.Op.like]: `%${search}%` } } : {};
    const { count, rows } = await Post.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName', 'profileImage'] }],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['createdAt', 'DESC']]
    });
    res.json({ posts: rows, total: count, page, pageSize });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName', 'profileImage'] }]
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const createPost = async (req, res) => {
  try {
    const { heading, content } = req.body;
    if (!heading || !heading.trim() || !content || !content.trim()) {
      return res.status(400).json({ message: 'Heading and content are required.' });
    }
    if (typeof heading !== 'string' || heading.trim().length > 100) {
      return res.status(400).json({ message: 'Heading must be a string up to 100 characters.' });
    }
    if (typeof content !== 'string' || content.trim().length > 2000) {
      return res.status(400).json({ message: 'Content must be a string up to 2000 characters.' });
    }
    const post = await Post.create({ userId: req.user.id, heading: heading.trim(), content: content.trim() });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { heading, content } = req.body;
    if ((heading !== undefined && !heading.trim()) && (content !== undefined && !content.trim())) {
      return res.status(400).json({ message: 'Heading or content must be provided and non-empty.' });
    }
    if (heading !== undefined) {
      if (typeof heading !== 'string' || !heading.trim() || heading.trim().length > 100) {
        return res.status(400).json({ message: 'Heading must be a non-empty string up to 100 characters.' });
      }
      post.heading = heading.trim();
    }
    if (content !== undefined) {
      if (typeof content !== 'string' || !content.trim() || content.trim().length > 2000) {
        return res.status(400).json({ message: 'Content must be a non-empty string up to 2000 characters.' });
      }
      post.content = content.trim();
    }
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
