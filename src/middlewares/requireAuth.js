const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    //authorization here is a string "Bearer aslduhfglasiduhflkj(token)"

    if(!authorization) {
        return res.status(401).send({ error: "You must be logged in please"})
    }

    const token = authorization.replace('Bearer ','')
    //this assigns the variable and removes the word Bearer, leaving just the token

    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: 'You must be logged in.' })
        }

        const { userId } = payload
        //if there is no error, then we can extract the information from the payload

        const user = await User.findById(userId)
        //we find the user based on the information provided

        req.user = user
        //user gets assigned to the req object

        next()
        //we can now call the next middleware in the chain of middlewares

    })
    //this verifies the token. the first arg is the token we want to verify. The second arg is the key. The third arg is the callback function are the jsonwebtoken has verified the token. Called with an err message if there is an error and payload. The payload is the information that we stuck into the token. In our case it is an object with the userId  
}