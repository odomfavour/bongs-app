import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isBargeModalOpen: false,
  isDeckModalOpen: false,
  isStoreOnBoardModalOpen: false,
  isProjectModalOpen: false,
  isUomModalOpen: false,
  isSafetyCategoryModalOpen: false,
  isVendorModalOpen: false,
  isLocationModalOpen: false,
  isBargeComponentModalOpen: false,
  bargeValues: {},
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    displayBargeValue: (state, action) => {
      state.bargeValues = action.payload; // Set bargValue to the action payload
    },
    toggleAddBargeModal: (state) => {
      state.isBargeModalOpen = !state.isBargeModalOpen; // Toggle modal state
    },
    toggleAddDeckModal: (state) => {
      state.isDeckModalOpen = !state.isDeckModalOpen;
    },
    toggleStoreOnBoardModal: (state) => {
      state.isStoreOnBoardModalOpen = !state.isStoreOnBoardModalOpen;
    },
    toggleAddProjectModal: (state) => {
      state.isProjectModalOpen = !state.isProjectModalOpen;
    },
    toggleUomModal: (state) => {
      state.isUomModalOpen = !state.isUomModalOpen;
    },
    toggleSafetyCategoryModal: (state) => {
      state.isSafetyCategoryModalOpen = !state.isSafetyCategoryModalOpen;
    },
    toggleVendorModal: (state) => {
      state.isVendorModalOpen = !state.isVendorModalOpen;
    },
    toggleLocationModal: (state) => {
      state.isLocationModalOpen = !state.isLocationModalOpen;
    },
    toggleBargeComponentModal: (state) => {
      state.isBargeComponentModalOpen = !state.isBargeComponentModalOpen;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  toggleAddBargeModal,
  toggleAddDeckModal,
  toggleStoreOnBoardModal,
  toggleAddProjectModal,
  toggleUomModal,
  toggleSafetyCategoryModal,
  toggleVendorModal,
  toggleLocationModal,
  toggleBargeComponentModal,
  displayBargeValue,
} = modalSlice.actions;

export default modalSlice.reducer;
