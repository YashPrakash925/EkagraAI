const express = require('express');
const router = express.Router();
const defineModels = require('../models');
const { requireAdmin } = require('../middleware/auth');

// Seed default project metadata if empty
async function seedProjectMeta() {
  try {
    const { ProjectMeta } = defineModels();
    const existing = await ProjectMeta.findByPk(1);
    if (!existing) {
      await ProjectMeta.create({
        id: 1,
        name: 'EkagraAI',
        courseLabel: 'UCS503 Software Engineering',
        subtitle: 'Productivity Tracker',
        description: 'EkagraAI is an intelligent productivity tracking application designed to help users monitor, analyze, and improve their productivity through meaningful insights and activity tracking.',
        version: 'V1',
        uploadedDate: '10 August 2026',
        techStack: JSON.stringify(['React', 'Node.js', 'Express.js', 'MySQL', 'AI/ML'])
      });
    }
  } catch (err) {
    console.error('Error seeding project metadata:', err);
  }
}

// GET /api/project
router.get('/', async (req, res) => {
  try {
    const { ProjectMeta, PPT } = defineModels();
    let meta = await ProjectMeta.findByPk(1);
    
    if (!meta) {
      await seedProjectMeta();
      meta = await ProjectMeta.findByPk(1);
    }

    const activePPT = await PPT.findOne({ order: [['id', 'DESC']] });

    const responseData = meta ? meta.toJSON() : {
      name: 'EkagraAI',
      courseLabel: 'UCS503 Software Engineering',
      subtitle: 'Productivity Tracker',
      description: 'EkagraAI is an intelligent productivity tracking application designed to help users monitor, analyze, and improve their productivity through meaningful insights and activity tracking.',
      version: 'V1',
      uploadedDate: '10 August 2026',
      techStack: JSON.stringify(['React', 'Node.js', 'Express.js', 'MySQL', 'AI/ML'])
    };

    responseData.techStackArray = typeof responseData.techStack === 'string' 
      ? JSON.parse(responseData.techStack) 
      : (responseData.techStack || ['React', 'Node.js', 'Express.js', 'MySQL', 'AI/ML']);

    responseData.hasPPT = !!activePPT;
    responseData.pptInfo = activePPT ? {
      id: activePPT.id,
      presentationName: activePPT.presentationName,
      uploadedAt: activePPT.uploadedAt,
      version: activePPT.version
    } : null;

    return res.json({ success: true, project: responseData });
  } catch (err) {
    console.error('Get project error:', err);
    return res.json({
      success: true,
      project: {
        name: 'EkagraAI',
        courseLabel: 'UCS503 Software Engineering',
        subtitle: 'Productivity Tracker',
        description: 'EkagraAI is an intelligent productivity tracking application designed to help users monitor, analyze, and improve their productivity through meaningful insights and activity tracking.',
        version: 'V1',
        uploadedDate: '10 August 2026',
        techStackArray: ['React', 'Node.js', 'Express.js', 'MySQL', 'AI/ML'],
        hasPPT: false
      }
    });
  }
});

// PUT /api/project (Admin only)
router.put('/', requireAdmin, async (req, res) => {
  try {
    const { ProjectMeta } = defineModels();
    let meta = await ProjectMeta.findByPk(1);
    const { version, uploadedDate, description, techStack } = req.body;

    if (!meta) {
      meta = await ProjectMeta.create({ id: 1 });
    }

    if (version) meta.version = version;
    if (uploadedDate) meta.uploadedDate = uploadedDate;
    if (description) meta.description = description;
    if (techStack) meta.techStack = JSON.stringify(techStack);

    await meta.save();
    return res.json({ success: true, project: meta });
  } catch (err) {
    console.error('Update project error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update project data.' });
  }
});

module.exports = { router, seedProjectMeta };
