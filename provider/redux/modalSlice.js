import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isBargeModalOpen: false,
  isDeckModalOpen: false,
  isDeckTypeModalOpen: false,
  isStoreOnBoardModalOpen: false,
  isProjectModalOpen: false,
  isUomModalOpen: false,
  isSafetyCategoryModalOpen: false,
  isVendorCategoryModalOpen: false,
  isVendorModalOpen: false,
  isLocationModalOpen: false,
  isBargeComponentModalOpen: false,
  isAddEngineModalOpen: false,
  isAddConsumeablesModalOpen: false,
  isAddUserModalOpen: false,
  isAddUserTypeModalOpen: false,
  isAddPermissionModalOpen: false,
  isAddDepartmentModalOpen: false,
  isAddRoleModalOpen: false,
  isAddInventoryTypeModalOpen: false,
  isLoading: false,
  inventoryType: '',
  inventoryData: {},
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
    toggleAddDeckTypeModal: (state) => {
      state.isDeckTypeModalOpen = !state.isDeckTypeModalOpen;
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
    toggleVendorCategoryModal: (state) => {
      state.isVendorCategoryModalOpen = !state.isVendorCategoryModalOpen;
    },
    toggleLocationModal: (state) => {
      state.isLocationModalOpen = !state.isLocationModalOpen;
    },
    toggleBargeComponentModal: (state) => {
      state.isBargeComponentModalOpen = !state.isBargeComponentModalOpen;
    },
    toggleAddUserTypeModal: (state) => {
      state.isAddUserTypeModalOpen = !state.isAddUserTypeModalOpen; // Toggle modal state
    },
    toggleAddRoleModal: (state) => {
      state.isAddRoleModalOpen = !state.isAddRoleModalOpen; // Toggle modal state
    },
    toggleAddPermissionModal: (state) => {
      state.isAddPermissionModalOpen = !state.isAddPermissionModalOpen; // Toggle modal state
    },
    toggleAddUserModal: (state) => {
      state.isAddUserModalOpen = !state.isAddUserModalOpen; // Toggle modal state
    },
    toggleAddDepartmentModal: (state) => {
      state.isAddDepartmentModalOpen = !state.isAddDepartmentModalOpen; // Toggle modal state
    },
    toggleLoading: (state, action) => {
      state.isLoading = action.payload; // Toggle modal state
      console.log('loadi', state.isLoading);
    },
    toggleAddEngineModal: (state, action) => {
      state.inventoryType = action.payload;
      state.isAddEngineModalOpen = !state.isAddEngineModalOpen;
    },
    toggleAddConsumeablesModal: (state, action) => {
      state.inventoryType = action.payload;
      state.isAddConsumeablesModalOpen = !state.isAddConsumeablesModalOpen;
    },
    toggleAddInventoryTypeModal: (state, action) => {
      state.inventoryData = action.payload;
      state.isAddInventoryTypeModalOpen = !state.isAddInventoryTypeModalOpen;
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
  toggleAddDeckTypeModal,
  toggleVendorCategoryModal,
  toggleAddEngineModal,
  toggleAddConsumeablesModal,
  toggleAddDepartmentModal,
  toggleAddUserModal,
  toggleAddUserTypeModal,
  toggleAddPermissionModal,
  toggleAddRoleModal,
  toggleAddInventoryTypeModal,
  toggleLoading,
} = modalSlice.actions;

export default modalSlice.reducer;
