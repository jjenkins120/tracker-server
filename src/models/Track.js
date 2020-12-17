const mongoose = require('mongoose')


const pointSchema = new mongoose.Schema({
    timestamp: Number, 
    //usually a datetime, but when it is pulled from the API is comes as a number
    coords: {
        latitude: Number,
        longitude: Number,
        altitude: Number,
        accuracy: Number,
        heading: Number,
        speed: Number,
    }
})

const trackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        //this tells us that the user id is referenceing some other object in mongo
        ref: 'User'
        //this essentially says it belongs to a user
    },
    name: {
        type: String, 
        default: ''
    }, 
    locations: [pointSchema]
    //this is saying that the pointSchema object is referenced here
})

mongoose.model('Track', trackSchema)
//we aren't calling pointSchema here because we don't want a collection of pointSchemas. the pointSchema object is embedded in the locations of trackSchema