import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import AppNavigator from './NavigationContainers/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoginProvider} from './Constants/AllContext';
import {Provider as ReduxProvider} from 'react-redux';
import {store as reduxStore} from './Redux/store';
const httpLink = createHttpLink({
  uri: 'https://gie-api.dev.rapidinnovation.tech/graphql',
});

const authLink = setContext(async (_, {headers}) => {
  /* get the authentication token from local storage if it exists**/
  const token = await AsyncStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

/**Initialize Apollo Client */
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

/**Using AppNavigator, where all navigation between different stack is done*/
const App = () => (
  <ReduxProvider store={reduxStore}>
    <LoginProvider>
      <ApolloProvider client={client}>
        <AppNavigator />
      </ApolloProvider>
    </LoginProvider>
  </ReduxProvider>
);

export default App;
