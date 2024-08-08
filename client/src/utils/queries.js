import { gql } from '@apollo/client';

// GET_ME
export const GET_ME = gql`
    query user($username: String!) {
        user(username: $username) {
            _id
            username
            email
            savedBooks {
                _id
                authors
                description
            }
        }
    }
`;