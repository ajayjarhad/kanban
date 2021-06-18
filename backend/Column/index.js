const { gql } = require("apollo-server-express");
const queryResolvers = require('./queryResolvers');
const mutationResolvers = require('./mutationResolvers');

const columnTypeDefs = gql`
type Column{
 id: ID!
 title: String!
 label: String!
 position: Int!
 description: String
 cards: [Card]
}

input insertColumnInput{
    title: String!
    label: String!
    position: Int!
}

input updateColumnPositionInput{
    columnId: String!
    position: Int!
}

extend type Query {
    hello: String
    fetchColumns: [Column]
}
extend type Mutation {
    insertColumn(request: insertColumnInput): Column
    updateColumnPosition(request: updateColumnPositionInput): Column
}
`;

const columnResolvers = {
    Query: {
        ...queryResolvers,
    },
    Mutation: {
        ...mutationResolvers,
    },
};

module.exports = {
    columnTypeDefs,
    columnResolvers,
};
