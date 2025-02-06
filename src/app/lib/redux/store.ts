import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './features/searchSlice';  // Your search reducer

export const store = configureStore({
	reducer: {
		search: searchReducer,
	},
});

// Types for usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
