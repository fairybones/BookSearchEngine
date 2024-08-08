import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import Navbar from './components/Navbar';

// create an instance of the ApolloClient class then specify GraphQL endpoint
const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

// create an Apollo Provider to handle all req with Apollo server
// wrap component tree with the ApolloProvider component to enable access to the ApolloClient from anywhere within the application
function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;