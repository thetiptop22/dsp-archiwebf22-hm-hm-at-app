const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const awardSchema = new Schema({

    given:{
        type:Date,
        required: false
    },

    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    ticket: {
        type: Schema.Types.Number,
        required: true,
        unique: [true, 'Ce tiket est déja utilisé'],
        ref: 'Gift',

    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: false,
    }
});

module.exports = mongoose.model('Award', awardSchema);
