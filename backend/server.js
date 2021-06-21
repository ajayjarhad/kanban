const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const merge = require("lodash.merge");
const mongoose = require("mongoose");
const { PubSub } = require("apollo-server");
const { createServer } = require("http");

const { cardResolvers, cardTypeDefs } = require("./card");
const { sectionResolvers, sectionTypeDefs } = require("./section");

const cardModel = require("./card/model");
const sectionModel = require("./section/model");
const SUBSCRIPTION_CONSTANTS = require("./subscriptionConstants");

const typeDefs = gql`
  type Subscription {
    sectionAdded: Section
    cardAdded: Card
    onSectionPosChange: Section
    onCardPosChange: Card
  }

  ${cardTypeDefs}
  ${sectionTypeDefs}
`;

const pubsub = new PubSub();

const SubscriptionsResolvers = {
  Subscription: {
    sectionAdded: {
      subscribe: () =>
        pubsub.asyncIterator([SUBSCRIPTION_CONSTANTS.SECTION_ADDED]),
    },
    cardAdded: {
      subscribe: () =>
        pubsub.asyncIterator([SUBSCRIPTION_CONSTANTS.CARD_ADDED]),
    },
    onSectionPosChange: {
      subscribe: () =>
        pubsub.asyncIterator([SUBSCRIPTION_CONSTANTS.ON_SECTION_POS_CHANGE]),
    },
    onCardPosChange: {
      subscribe: () =>
        pubsub.asyncIterator([SUBSCRIPTION_CONSTANTS.ON_CARD_POS_CHANGE]),
    },
  },
};

const customResolvers = {
  Section: {
    cards(parent, args, cxt) {
      return cxt.card.getCardBySectionId(parent._id);
    },
  },
};

const resolvers = merge(
  cardResolvers,
  sectionResolvers,
  customResolvers,
  SubscriptionsResolvers
);
// Code that starts the server.
async function startServer() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => ({   // Using graphQL context.
            card: cardModel,
            section: sectionModel,
            publisher: pubsub,
            SUBSCRIPTION_CONSTANTS: SUBSCRIPTION_CONSTANTS,
        }),
    });
    await apolloServer.start();
    
    const app = express();
    apolloServer.applyMiddleware({ app: app }); // This line of code let us to use graphql playgrould @ url/graphql
    const httpServer = createServer(app);
    apolloServer.installSubscriptionHandlers(httpServer);
    await mongoose.connect('mongodb://localhost:27017/kanban',{  //This line of code helps establishing the connection to MongoDB
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
    console.log('Connection to mongose is successful')
    httpServer.listen(4444, () => console.log('The server is live on port 4444'));
}
startServer();