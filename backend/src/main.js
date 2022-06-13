import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';

import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';

async function startApolloServer(typeDefs, resolvers) {

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({

    typeDefs,
    resolvers,

    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],

  });

  await server.start();

  // bodyParserConfig - com valor true, vai trabalhar com JSON.
  server.applyMiddleware({ 
    app, 
    cors: {
      origin: 'http://localhost:3000',
    },
    bodyParserConfig: true
  });

  await new Promise(resolve => httpServer.listen({ port: 8000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:8000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);

//https://www.apollographql.com/docs/apollo-server/integrations/middleware/