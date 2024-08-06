const { GraphQLError } = require('graphql');
const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

const secret = 'soosupersecret';
const expiration = '3h';

module.exports = {
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
},
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
    if (!token) {
      return req;
    }
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      // set user context
      req.user = data;
    } catch {
      throw new AuthenticationError('Token invalid.');
    }
    return req;
  },
  AuthenticationError: new GraphQLError('Oop! Cannot authenticate user.', {
        extensions: {
            code: 'UNAUTHENTICATED',
        },
    }),
};