const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase, getSequelize } = require('./config/db');
const defineModels = require('./models');

const { router: authRouter, seedAdminUsers } = require('./routes/auth');
const { router: projectRouter, seedProjectMeta } = require('./routes/project');
const { router: changesRouter, seedChangeLogs } = require('./routes/changes');
const { router: pptRouter, seedDefaultPPT } = require('./routes/ppt');
const { router: teamRouter, seedTeamMembers } = require('./routes/team');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register Routes
app.use('/api/auth', authRouter);
app.use('/api/project', projectRouter);
app.use('/api/changes', changesRouter);
app.use('/api/ppt', pptRouter);
app.use('/api/team', teamRouter);
app.get("/", (req, res) => {
  res.send("EkagraAI Backend Running");
});
// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});


// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();
    const sequelize = getSequelize();
    defineModels();

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('[Database] Table schemas synchronized successfully.');

    // Seed default data
    await seedAdminUsers();
    await seedProjectMeta();
    await seedChangeLogs();
    await seedTeamMembers();
    console.log('[Database] Default seed data initialized.');

    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`🚀 EkagraAI Backend Server running on port ${PORT}`);
      console.log(`👉 API Base: http://localhost:${PORT}/api`);
      console.log(`=================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();
