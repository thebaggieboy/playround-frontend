import React from "react";
import { Provider } from "react-redux";
import store, { peristor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const Providers = ({ children }) => {
	const queyClient = new QueryClient()

	return (
		<QueryClientProvider client={queyClient}>
			<Provider store={store}>
				<PersistGate loading={null} persistor={peristor}>
					{children}
				</PersistGate>
			</Provider>
		</QueryClientProvider>
	);
};

export default Providers;
