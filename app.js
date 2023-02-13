const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql'); //middleware to parse and handle graphql requests
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const dotenv = require('dotenv'); //import env variables
dotenv.config();

const app = express()

app.use(bodyParser.json()); //to parse incoming json bodies

const events = []

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
        events: () => {
            return events
        },
        createEvent: (args) => {
            const event = {
                _id: 1,
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: "test"
            }
            events.push(event)
            return event
        }
    },
    graphiql: true //for api testing
}))

//connect to db
mongoose.connect(`mongodb+srv://can-read-and-write:${process.env.MONGO_PASSWORD}@event-booking.r5bjftn.mongodb.net/?retryWrites=true&w=majority`)
    .then(
        app.listen(3000)
    ).catch(err => {
        console.log(err);
    })
