const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    _id: Schema.Types.ObjectId,
    number: {
        type: Number,
        require: true
    },
    gift: {
        type: Schema.Types.ObjectId,
        ref: 'Gift',
        required: true,
    }
});

module.export = mongoose.model('Ticket', ticketSchema);