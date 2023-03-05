const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const giftSchema = new Schema({
    _id: Schema.Types.ObjectId,

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
});

module.export = mongoose.model('Gift', giftSchema);
