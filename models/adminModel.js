const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    _id: Schema.Types.ObjectId,

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role: {
        type : String,
        enum:['admin','employe'],
        default:'user'

    }
 
});

module.export = mongoose.model('Admin', adminSchema);