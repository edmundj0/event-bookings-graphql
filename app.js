const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql'); //middleware to parse and handle graphql requests
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const Event = require("./models/event")
const User = require('./models/user')

const dotenv = require('dotenv'); //import env variables
dotenv.config();

const app = express()

app.use(bodyParser.json()); //to parse incoming json bodies


app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }

    `),
    //resolvers
    rootValue: {
        events: async () => {
            try {
                return await Event.find().lean();
            } catch (err) {
                throw err
            }
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '63eab061aad97e6cb740ba94'
            });
            let createdEvent;
            return event
                .save() //save to db
                .then(result => {
                    createdEvent = { ...result._doc }
                    return User.findById('63eab061aad97e6cb740ba94')
                })
                .then(user => {
                    if (!user){
                        throw new Error('User not found') //rarely will hit this
                    }
                    user.createdEvents.push(event);
                    return user.save()
                })
                .then(result => {
                    return createdEvent;
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
        },
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
    },
    graphiql: true //for api testing
}))

//connect to db
mongoose.connect(`mongodb+srv://can-read-and-write:${process.env.MONGO_PASSWORD}@event-booking.r5bjftn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(
        app.listen(3000)
    ).catch(err => {
        console.log(err);
    })
