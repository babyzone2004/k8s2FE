import { createApp, provide, h } from "vue";
import { createPinia } from "pinia";
import { DefaultApolloClient } from "@vue/apollo-composable";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client/core";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import Cookies from "js-cookie";
// import ClientMonitor from "skywalking-client-js";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const cache = new InMemoryCache({
  addTypename: false,
});

const requestId = Cookies.get("x-request-id");

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_HOST,
  headers: {
    "x-request-id": requestId,
  },
});

const apolloClient = new ApolloClient({
  cache,
  link: httpLink,
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

Sentry.init({
  app,
  dsn: "https://4a56e996a8a5416fa88e8a526599b274@o4504813433847808.ingest.sentry.io/4504813436338176",
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracePropagationTargets: ["localhost", "my-site-url.com", /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

if (requestId) {
  Sentry.configureScope((scope) => {
    scope.setTag("request_id", requestId);
  });
}

// Report collected data to `http:// + window.location.host + /browser/perfData` in default
// ClientMonitor.register({
//   service: "vue",
//   pagePath: "/index",
//   serviceVersion: "v1.0.0",
//   detailMode: true,
//   traceSDKInternal: true,
// });

app.use(createPinia());
app.use(router);

app.mount("#app");
