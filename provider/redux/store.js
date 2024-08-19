import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modalSlice';
import userReducer from './userSlice';
import procurementReducer from './procurementSlice';
export const store = configureStore({
  reducer: {
    modal: modalReducer,
    user: userReducer,
    procurement: procurementReducer
  },
});
