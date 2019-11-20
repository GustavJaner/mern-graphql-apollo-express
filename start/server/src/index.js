const { ApolloServer } = require('apollo-server');
const isEmail = require('isemail');

const { createStore } = require('./utils');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

const store = createStore();

// Apollo server instance
const server = new ApolloServer({
  context: async ({ req }) => {
    // Simple Auth check on every req(request) to the GraphQL API
    const auth = req.headers && req.headers.authorization || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');

    // If not valid Email
    if (!isEmail.validate(email)) return { user: null };

    // Find user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] || null;

    return { user: { ...user.dataValues } };
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store }),
  }),
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});


// Resolver functions definition/implementation
// const resolvers = {
//     Query,
//     Mutation,
//     User,
//     Link,
//   };

//   const server = new GraphQLServer({
//     typeDefs: './src/schema.graphql',
//     resolvers,
//     context: request => {
//       return {
//         ...request,
//         prisma,
//       }
//     },
//   });
