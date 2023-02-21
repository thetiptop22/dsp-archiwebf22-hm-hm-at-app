const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    _id: Schema.Types.ObjectId,

   firstname: {
        type: String ,
        required: true
    },
  
   birthDay:{
        type:Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

module.export = mongoose.model('Client', clientSchema);