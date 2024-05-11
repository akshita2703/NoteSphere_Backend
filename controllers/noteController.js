const { StatusCodes } = require('http-status-codes');

const crypto = require('crypto');


const Note = require('./../model/note');
const user = require('./../model/user');

const createNote = async (req, res) => {
    try {
        const { title, description } = req.body;
        const user1 = req.user;
        const user_id = user1.id;
        console.log(user1);

        const responseObj = {
            isVerified: false,
            msg: 'default-obj-msg',
            data: {}
        };

        console.log(responseObj);
        if (!title || !description) {
            responseObj.msg = `All fields are required`;
            return res.status(400).json(responseObj);
        }
        console.log(1);

        const newData = { title, description, user_id };
        console.log(newData);
        const store = await Note.create({ ...newData });
        console.log(store);
        responseObj.isVerified = true;
        responseObj.msg = `All fields are stored`;
        responseObj.data.title = title;
        responseObj.data.description = description;

        return res.status(200).json(responseObj);
    } catch (error) {
        console.log("Error in storing data", error);
        return res.status(500).json({
            isVerified: false,
            msg: 'Internal server error'
        });
    }
}

const readNote = async (req, res) => {
    try {
        // Get the user ID from the authenticated user
        const userId = req.user.id;

        // Find all notes created by the user
        const userNotes = await Note.find({ user_id: userId });

        // If no notes found, return an empty array
        if (!userNotes || userNotes.length === 0) {
            return res.status(404).json({ error: "No notes found for this user" });
        }

        // Return the user's notes
        res.json(userNotes);
    } catch (error) {
        console.error("Error reading user's notes:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const user1 = req.user;
        const userId = user1.id;

        // Find the note
        const foundNote = await Note.findOne({ _id: noteId });

        // If note not found, return 404 error
        if (!foundNote) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Note not found" });
        }

        // Check if the note belongs to the authenticated user
        if (foundNote.user_id.toString() !== userId) {
            return res.status(StatusCodes.FORBIDDEN).json({ error: "Unauthorized access to delete this note" });
        }

        // Delete the note
        await Note.deleteOne({ _id: noteId });

        // Return success message
        return res.status(StatusCodes.OK).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error deleting note:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}


module.exports = { createNote, readNote, deleteNote };


