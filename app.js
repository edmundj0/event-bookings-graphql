const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql'); //middleware to parse and handle graphql requests
const mongoose = require('mongoose');
const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')


const dotenv = require('dotenv'); //import env variables
dotenv.config();

const app = express()

app.use(bodyParser.json()); //to parse incoming json bodies


app.use(isAuth) //will never throw an error, only checks if is authorized



app.use('/graphql', graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true //for api testing
}))

//connect to db
mongoose.connect(`mongodb+srv://can-read-and-write:${process.env.MONGO_PASSWORD}@event-booking.r5bjftn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(
        app.listen(3000)
    ).catch(err => {
        console.log(err);
    })
