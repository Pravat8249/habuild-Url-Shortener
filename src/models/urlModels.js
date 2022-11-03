const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({

    urlCode: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    longUrl: {
        type: String,
        required: true,
        trim: true
    },

    shortUrl:{
        type:String,
        required:true,
        unique:true,
        trim:true

    },
    expiry:{
        type :Date,
      
        default: Date.now()
    },
    isDeleted:{
        type: Boolean,
        default: false
    }


},{ timestamps: true });

module.exports = mongoose.model('UrlShortner', urlSchema);