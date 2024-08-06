const { User } = require('../models');
// set up JWT for login authentication
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            // only authenticated user can access user data
            if (context.user) {
                return User.findById(context.user._id).populate('savedBooks');
            }
            throw new AuthenticationError('Please login to view saved books.');
        },
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email: email });
            // confirm that user exists
            if (!user) {
                throw AuthenticationError('No user found, sign up now!');
            } // if exists, run password validation method
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError("Your password is incorrect.");
            } // if email & password check out, sign in with a jwt
            const token = signToken(user);
            // return Auth object with token & user info
            return { token, user };
        },
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            // return user with jwt token for easy auth
            return { token, user };
        },
        saveBook: async (parent, { authors, description, title, bookId, image, link }) => {
            // use user context to ensure the user is authenticated
            if (context.user) {
                const saveToUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $addToSet: { savedBooks: { authors, description, title, bookId, image, link }}},
                    { new: true, runValidators: true }
                ).populate('savedBooks');
                return saveToUser;
            }
            throw new AuthenticationError('You need to login to save books.')
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updateUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $pull: { savedBooks: { bookId }}},
                    { new: true }
                ).populate('savedBooks');
                return updateUser;
            }
            throw new AuthenticationError('Please login to remove books.')
        }
    }
};

module.exports = resolvers;