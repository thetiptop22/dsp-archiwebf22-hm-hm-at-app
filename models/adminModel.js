const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role: {
        type : String,
        enum:['admin','employe'],
        required : true

    }

});

module.exports = mongoose.model('Admin', adminSchema);
