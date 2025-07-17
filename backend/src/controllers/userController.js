
import redisClient from '../redisClient.js';
import User from '../models/user.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user.id, email: user.email, profileImage: user.profileImage, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.email = req.body.email || user.email;
    if (req.file) user.profileImage = req.file.path;

    if (req.body.currentPassword && req.body.password) {
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    await user.save();

    await redisClient.del(`user:profile:${user.id}`);

    const keys = await redisClient.keys('user:list:*');
    if (keys.length > 0) await redisClient.del(keys);

    res.json({ id: user.id, email: user.email, profileImage: user.profileImage, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const listUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || '';
    const cacheKey = `user:list:page=${page}&size=${pageSize}&search=${search}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const { default: User } = await import('../models/user.js');
    const where = search ? { email: { [Op.like]: `%${search}%` } } : {};

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: ['id', 'email', 'profileImage', 'role', 'isEmailVerified', 'createdAt'],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['createdAt', 'DESC']]
    });

    const result = { users: rows, total: count, page, pageSize };
    await redisClient.setEx(cacheKey, 120, JSON.stringify(result));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const suspendUser = async (req, res) => {
  try {
    if (req.user.id == req.params.id) {
      return res.status(403).json({ message: "Admins cannot suspend themselves." });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isSuspended = true;
    await user.save();
    await redisClient.del(`user:profile:${user.id}`);
    const keys = await redisClient.keys('user:list:*');
    if (keys.length > 0) await redisClient.del(keys);
    res.json({ message: 'User suspended', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const unsuspendUser = async (req, res) => {
  try {
    if (req.user.id == req.params.id) {
      return res.status(403).json({ message: "Admins cannot unsuspend themselves." });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isSuspended = false;
    await user.save();
    await redisClient.del(`user:profile:${user.id}`);
    const keys = await redisClient.keys('user:list:*');
    if (keys.length > 0) await redisClient.del(keys);
    res.json({ message: 'User unsuspended', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    if (req.user.id == req.params.id) {
      return res.status(403).json({ message: "Admins cannot delete themselves." });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();


    await redisClient.del(`user:profile:${req.params.id}`);
    const keys = await redisClient.keys('user:list:*');
    if (keys.length > 0) await redisClient.del(keys);

    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getUserProfile = async (req, res) => {
  const userId = req.params.id;
  try {
    const cached = await redisClient.get(`user:profile:${userId}`);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const { default: User } = await import('../models/user.js');
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'profileImage', 'role', 'isEmailVerified', 'createdAt']
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    await redisClient.setEx(`user:profile:${userId}`, 300, JSON.stringify(user));
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
