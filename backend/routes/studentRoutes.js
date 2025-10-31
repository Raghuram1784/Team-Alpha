const express = require('express');
const router = express.Router();
const {
  createStudent,
  getStudents,
  markAsPaid,
  selectBatch
} = require('../controllers/studentController');

router.post('/students', createStudent);
router.get('/students', getStudents);
router.put('/students/:id/pay', markAsPaid);
router.post('/students/:id/batch', selectBatch);

module.exports = router;