const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const posterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true 
    },
    category: {
        type: String,
        required: true
    }
}, {timestamps: true}); 

const Poster = mongoose.model('Poster', posterSchema); 

module.exports = Poster;