import { createStore } from 'redux';

// Initial state
const initialState = {};

// Reducer
const rootReducer = (state = initialState, action: any) => {
    switch (action.type) {
        // Define your actions here
        default:
            return state;
    }
};

// Create store
const store = createStore(rootReducer);

export default store;
