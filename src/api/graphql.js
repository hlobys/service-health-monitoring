import { ApolloClient } from 'apollo-client'
import { from } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory'

const getHttpLink = (schema = 'admin') => (
  new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_API_ENDPOINT,
    credentials: 'include',
    headers: {
      schema
    }
  })
);

const cache = new InMemoryCache({
  addTypename: false
});

const headersLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers
    }
  }
});

const getClient = (schema = 'admin') => (
  new ApolloClient({
    link: from([
      window.tarantool_enterprise_core.apiMethods.apolloLinkAfterware,
      window.tarantool_enterprise_core.apiMethods.apolloLinkOnError,
      window.tarantool_enterprise_core.apiMethods.apolloLinkMiddleware,
      headersLink.concat(getHttpLink(schema))
    ]),
    cache,
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache'
      },
      mutate: {
        fetchPolicy: 'no-cache'
      },
      watchQuery: {
        fetchPolicy: 'no-cache'
      }
    }
  })
);

const defaultSchemaClient = getClient('default');

export default {
  fetch(query, variables = {}, context = {}) {
    return defaultSchemaClient.query({ query, variables, context }).then(r => r.data);
  },
  mutate(mutation, variables = {}) {
    return defaultSchemaClient.mutate({ mutation, variables: variables }).then(r => r.data);
  }
};

export const isGraphqlErrorResponse
  = error => Array.isArray(error.graphQLErrors) && !!error.graphQLErrors[0] && 'message' in error.graphQLErrors[0];

export const getGraphqlErrorMessage
  = error => error.graphQLErrors[0].message || 'GraphQL error with empty message';

export const isGraphqlAccessDeniedError
    = error =>
      (isGraphqlErrorResponse(error) && getGraphqlErrorMessage(error) === 'Unauthorized')
  || (error.networkError && error.networkError.statusCode === 401);
