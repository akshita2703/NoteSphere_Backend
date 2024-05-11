const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');



const noteSchema = new mongoose.Schema ({
    
    title:{
        type:String,
        required:true,
    },
    description:{
        type : String,
        required:true,
    },
    user_id : {
        type : String,
        required: true,
    }
    // download:{
    //     type: Boolean,
    //     required: true,
    // },
});
module.exports =  mongoose.model("Note", noteSchema);


