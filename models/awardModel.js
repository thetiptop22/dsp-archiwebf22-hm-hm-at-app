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
        type: Number,
        required: true,
        unique: [true, 'Ce tiket est déja utilisé']
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: false,
    }
});

module.exports = mongoose.model('Award', awardSchema);
