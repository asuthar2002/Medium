import User from '../models/user.js';
import Post from '../models/post.js';

export const getStats = async (req, res) => {
  try {
    const userCount = await User.count();
    const postCount = await Post.count();
    const suspendedCount = await User.count({ where: { isSuspended: true } });
    res.json({ userCount, postCount, suspendedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
