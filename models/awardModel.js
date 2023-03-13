const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const awardSchema = new Schema({
    _id: Schema.Types.ObjectId,

    given:{
        type:Date,
        required: false
    },

    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: false,
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: false,
    }
});

module.exports = mongoose.model('Award', awardSchema);
