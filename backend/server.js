// Importing libraries
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require("mongoose");
const merge = require('lodash.merge');
const { PubSub } = require("apollo-server");
const { createServer } = require("http");
const columnModel = require('./Column/model');
const cardModel = require('./Card/model')
const { columnResolvers, columnTypeDefs } = require('./Column')
const { cardResolvers, cardTypeDefs } = require("./Card");
const SUBSCRIPTION_CONSTANTS = require("./subscriptionConstants");

//Here I will write my graphQL queries.
const typeDefs = gql`
type Subscription{
    columnAdded: Column
    cardAdded: Card
    onColumnPositionChnage: Column
    onCardPositionChange: Card
}
${cardTypeDefs}
${columnTypeDefs}
`;

const pubsub = new PubSub();

const SubscriptionResolvers = {
    Subscription: {
        columnAdded: {
            subscribe: () =>
                pubsub.asyncIterator([SUBSCRIPTION_CONSTANTS.COLUMN_ADDED]),
        },
        cardAdded: {
            subscribe: () =>
                pubsub.asyncIterator([SUBSCRIPTION_CONSTANTS.CARD_ADDED]),
        },
        onColumnPositionChange: {
            subscribe: () =>
                pubsub.asyncIterator([SUBSCRIPTION_CONSTANTS.ON_COLUMN_POSITION_CHANGE]),
        },
        onCardPositionChange: {
            subscribe: () =>
                pubsub.asyncIterator([ SUBSCRIPTION_CONSTANTS.ON_CARD_POSITION_CHANGE ])
        },
    },
};

//Here is code for the resolver.
const customResolvers = {
    Column: {
        cards(parents, args, cxt) {
            return cxt.card.getCardBySectionId(parents._id);
       },
   },
};

const resolvers = merge(
    columnResolvers,
    cardResolvers,
    customResolvers,
    SubscriptionResolvers
)


// Code that starts the server.
async function startServer() {
    const app = express();
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => ({   // Using graphQL context.
            card: cardModel,
            column: columnModel,
            publisher: pubsub,
            SUBSCRIPTION_CONSTANTS: SUBSCRIPTION_CONSTANTS,
        }),
    });
    await apolloServer.start();
    const httpServer = createServer(app);
    server.installSubscriptionHandlers(httpServer);
    apolloServer.applyMiddleware({ app: app }); // This line of code let us to use graphql playgrould @ url/graphql
    await mongoose.connect('mongodb://localhost:27017/kanban',{  //This line of code helps establishing the connection to MongoDB
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
    console.log('Connection to mongose is successful')
    app.listen(4000, () => console.log('The server is live on port 4000'));
}
startServer();