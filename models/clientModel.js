const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({

   firstname: {
        type: String ,
        required: false
    },

   birthDay:{
        type:Date,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

module.exports = mongoose.model('Client', clientSchema);
