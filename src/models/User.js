const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        unique: true,
        required: true
    },
    password: {
        type: String, 
        required: true
    }
})
//this is the user model in mongoose. this is also how we tell mongoose what properties each user has - and what validations are necessary

userSchema.pre('save', function(next){
    const user = this
    //we have to use a keyword function in order to get assess to this to the user we are trying to save
    if (!user.isModified('password')){
        return next()
    }
    //just checking to see if the user has modified their password. If they haven't, we don't need to salt anything 

    bcrypt.genSalt(10, (err, salt) => {
        if (err){
            return next(err)
        }
        //if there was an error in generating our salt, pass in the error

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err){
                return next(err)
            }

            user.password = hash
            //we've now replaced the user's password with the salted and hashed password
            next()

        })
        //generating the hash

    })
    //function used to generate the salt

})
//this is a function that is going to run before we attempt to save a user instance into our database. We will examine the password of the user. If the user has a plain text password, then we will generate salt and then we will hash the password and the salt together to store in the database

userSchema.methods.comparePassword = function(candidatePassword) {
    const user = this
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err){
                reject(err)
            }

            if (!isMatch){
                return reject(false)
            }
            //says the passwords did not match

            resolve(true)
            //if the comparison gets past the first two checks, then it resolves to true and can proceed

        })
        //the first are is the candidates password that was provided to us, the second arg is the salted and hashed password that is stored inside our database (of this instance's user). The third arg is a callback function to verify a match. 
    })
    //we create a new promise. If the code behaves as expect, we call resolve. if it doesn't, we will call reject. The only reason we are creating a promise here is in order to call the async function because the bcrypt library only relys on callbacks
}
//candidatePassword is what the user is trying to login with


mongoose.model('User', userSchema)