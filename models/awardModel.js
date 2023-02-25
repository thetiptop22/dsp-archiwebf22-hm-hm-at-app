const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const awardSchema = new Schema({
    _id: Schema.Types.ObjectId,

    given:{
        type:Date,
        required: true
    },
  
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    }
});

module.export = mongoose.model('Award', awardSchema);