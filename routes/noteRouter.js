const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate')

const { createNote, readNote,deleteNote } = require('./../controllers/noteController');

router.post('/create', authenticate, createNote);
router.get('/read/', readNote);
router.delete('/notes/:noteId',authenticate,deleteNote);
// app.get('/notes/:noteId', readNote);

module.exports = router;
