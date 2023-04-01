const bcrypt = require('bcryptjs')

const User = require('../../models/user')


module.exports = {
    createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
            .then(user => {
                if (user) {
                    throw new Error('Email already exists.')
                }
                return bcrypt.hash(args.userInput.password, 12)  //12 rounds of salting
                    .then(hashedPassword => {
                        const user = new User({
                            email: args.userInput.email,
                            password: hashedPassword
                        })
                        return user.save();
                    })
                    .then(result => {
                        return { ...result._doc, password: null }
                    })
                    .catch(err => {
                        throw err
                    })
            })
    }
}
