const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const giftSchema = new Schema({
    label: {
        type: String,
        required: true,
    },

    quota: {
        type: Number,
        required: true,
    },

    value: {
        type: Number,
        required: true,
    },
    ticket: {
        type: Number,
        required: true,
    },
});

giftSchema.plugin(AutoIncrement, {inc_field: 'ticket', start_seq: 1000});


module.exports = mongoose.model('Gift', giftSchema);
