const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate')

const { createNote, readNote,deleteNote,updateNote } = require('./../controllers/noteController');

router.post('/create', authenticate, createNote);
router.get('/read/', readNote);
router.delete('/notes/:noteId',authenticate,deleteNote);
router.put('/update/:noteId',authenticate,updateNote);
// app.get('/notes/:noteId', readNote);

module.exports = router;
