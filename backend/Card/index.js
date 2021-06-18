const { gql } = require('apollo-server-express');
const mutationResolvers = require("./mutationResolvers");
const queryResolvers = require('./queryResolvers');

const cardTypeDefs = gql`
input insertCardInput{
    title: String!
    label: String!
    columnId: ID!
    position: Int!
}
input updateCardPositionInput{
    cardId: String!
    columnId: String!
    position:Int!
}
input cardColumnInput{
    columnId: String!
}
type Card{
    id: ID
    title: String!
    label: String!
    description: String
    position: Int
    columnId: String!
}
type Query{
    card: String
    fetchCardsByColumnId(request: cardColumnInput): [Card]
}
type Mutation{
    insertCard(request: insertCardInput): Card
    updateCardPosition(request: updateCardPositionInput): Card
}
`;

const cardResolvers = {
    Query: {
        ...queryResolvers,
    },
    Mutation: {
        ...mutationResolvers,
    },
};

module.exports = {
    cardTypeDefs,
    cardResolvers,
}