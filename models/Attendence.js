const mongoose = require('mongoose');

const AttendenceSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',

    },
    date:{
        type:String,

    },
    inTime:{
        type:String,
    },
    outTime:{
        type:String,
    },
    location:{
        type: String,

    },
    workingHours:{
        type: String,

    }
}, {timestamps:true});

const Attendence = mongoose.model('Attendence', AttendenceSchema);

module.exports = Attendence;

