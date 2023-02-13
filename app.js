const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql'); //middleware to parse and handle graphql requests


const { buildSchema } = require('graphql');

const app = express()

app.use(bodyParser.json()); //to parse incoming json bodies

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }

    `),
    //resolvers
    rootValue: {
        events: () => {
            return ["test event", "test event 2"]
        },
        createEvent: (args) => {
            const eventName = args.name
            return eventName
        }
    },
    graphiql: true //for api testing
}))




app.listen(3000);
