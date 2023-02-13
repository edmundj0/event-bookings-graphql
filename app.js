const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql'); //middleware to parse and handle graphql requests
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require("./models/event")

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

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
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
            // const event = {
            //     _id: 1,
            //     title: args.eventInput.title,
            //     description: args.eventInput.description,
            //     price: args.eventInput.price,
            //     date: "test"
            // }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            return event
                .save() //save to db
                .then(result => {
                    console.log(result)
                    return {...result._doc}
                })
                .catch(err => {
                    console.log(err)
                    throw err
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
