
import { sequelize } from './sequelize.js';
import User from './user.js';
import Post from './post.js';

User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, User, Post };
