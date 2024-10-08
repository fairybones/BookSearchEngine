const express = require('express');
const path = require('path');
// import ApolloServer class & express middleware
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
// import JWT authentication
const { authMiddleware } = require('./utils/auth');

// import the two parts of a GraphQL schema
const { typeDefs, resolvers } = require('./schemas');

const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs, resolvers
});

// import mongoDB connection
const db = require('./config/connection');

// initialize application
const app = express();

// create new instance of ApolloServer with GraphQL schema
const startApolloServer = async () => {
  await server.start();

  // middleware for url, json, graphql
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  })};

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`Express server running on port ${PORT}!`);
    });
  });
};

// call async function to start the server
startApolloServer();