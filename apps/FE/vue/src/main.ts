import { createApp, provide, h } from "vue";
import { createPinia } from "pinia";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const cache = new InMemoryCache({
  addTypename: false,
});
const apolloClient = new ApolloClient({
  cache,
  uri: import.meta.env.VITE_API_HOST,
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

app.use(createPinia());
app.use(router);

app.mount("#app");
