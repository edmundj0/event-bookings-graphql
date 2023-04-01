const bcrypt = require('bcryptjs')

const User = require('../../models/user')
const jwt = require('jsonwebtoken')


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
    },
    login: async ({email, password}) => {
        const user = await User.findOne({email: email})

        if(!user) {
            throw new Error('User does not exist')
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual) {
            throw new Error('Password is incorrect')
        }

        const token = jwt.sign({userId: user.id, email: user.email}, 'secretkey', {expiresIn: '1h'})

        return { userId: user.id, token: token, tokenExpiration: 1}

    }
}
