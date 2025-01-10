import React from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./AppRouter";

import { ApolloClient, InMemoryCache, ApolloProvider, gql, HttpLink } from '@apollo/client';


document.addEventListener("turbo:load", () => {

    const csrfToken = document.querySelector('meta[name=csrf-token]')?.getAttribute('content') || '';
    const link = new HttpLink({
        credentials: 'same-origin',
        headers: {
            'X-CSRF-Token': csrfToken
        }
    });

    const client = new ApolloClient({
        uri: '/graphql',
        link,
        cache: new InMemoryCache(),
    });

    const root = createRoot(document.body.appendChild(document.createElement("div")));
    root.render(
        <ApolloProvider client={client}>
            <AppRouter />
        </ApolloProvider>
    );
});