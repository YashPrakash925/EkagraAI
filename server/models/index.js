const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/db');

function defineModels() {
  const sequelize = getSequelize();

  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    username: { type: DataTypes.STRING, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'admin' }
  });

  const ProjectMeta = sequelize.define('ProjectMeta', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, defaultValue: 'EkagraAI' },
    courseLabel: { type: DataTypes.STRING, defaultValue: 'UCS503 Software Engineering' },
    subtitle: { type: DataTypes.STRING, defaultValue: 'Productivity Tracker' },
    description: { type: DataTypes.TEXT, defaultValue: 'EkagraAI is an intelligent productivity tracking application designed to help users monitor, analyze, and improve their productivity through meaningful insights and activity tracking.' },
    version: { type: DataTypes.STRING, defaultValue: 'V1' },
    uploadedDate: { type: DataTypes.STRING, defaultValue: '10 August 2026' },
    techStack: { type: DataTypes.TEXT, defaultValue: JSON.stringify(['React', 'Node.js', 'Express.js', 'MySQL', 'AI/ML']) }
  });

  const ChangeLog = sequelize.define('ChangeLog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    version: { type: DataTypes.STRING, allowNull: false },
    dateTimeStr: { type: DataTypes.STRING, allowNull: false }
  });

  const PPT = sequelize.define('PPT', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    presentationName: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Presentation' },
    originalFilePath: { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
    pdfFilePath: { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
    fileSize: { type: DataTypes.INTEGER, defaultValue: 0 },
    version: { type: DataTypes.STRING, defaultValue: 'V1' },
    uploadedBy: { type: DataTypes.STRING, defaultValue: 'Yash Prakash' },
    uploadedAt: { type: DataTypes.STRING, allowNull: false, defaultValue: '10 Aug 2026' }
  });

  const TeamMember = sequelize.define('TeamMember', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    rollNo: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    displayOrder: { type: DataTypes.INTEGER, defaultValue: 1 }
  });

  return { User, ProjectMeta, ChangeLog, PPT, TeamMember };
}

module.exports = defineModels;
