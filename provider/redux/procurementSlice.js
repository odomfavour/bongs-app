import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  draftProcurementState: {
    subscriber: "",
    subscriberId: "",
    procurementId: "",
    title: "",
    id: null,
    bidding_deadline: "",
    vendor_category: "",
    vendor: "",
    vendors: [],
    rfqStatus: "",
    procurementType: "",
    draftList: {
      stock_quantity: null,
      description: "",
      attachments: [],
    },
  },
  allCategory: [],
  allProjects: [],
  allVendorsCategory: [],
  allDepartments: [],
  allVendors: [],
};

export const procurementSlice = createSlice({
  name: "procurement",
  initialState,
  reducers: {
    setDraftStateAction: (state, action) => {
      console.log("state", action);
      state.draftProcurementState.procurementType =
        action.payload.procurementType;
      state.draftProcurementState.rfqStatus = action.payload.rfqStatus;
      state.draftProcurementState.subscriber = action.payload.subscriber;
      state.draftProcurementState.subscriberId = action.payload.subscriberId;
      state.draftProcurementState.id = action.payload.id;
      state.draftProcurementState.title = action.payload.title;
      state.draftProcurementState.draftList = action.payload.draftList;
      state.draftProcurementState.procurementId = action.payload.procurementId;
      state.draftProcurementState.vendors = action.payload.vendors;
      state.draftProcurementState.budget = action.payload.budget;
      state.draftProcurementState.bidding_deadline =
        action.payload.bidding_deadline;
      state.draftProcurementState.vendor_category =
        action.payload.vendor_category;
      state.draftProcurementState.departmentId = action.payload.departmentId;
    },
    populateAllCategory: (state, action) => {
      state.allCategory = action.payload;
    },
    populateAllProjects: (state, action) => {
      state.allProjects = action.payload;
    },
    populateAllVendorsCateroy: (state, action) => {
      state.allVendorsCategory = action.payload;
    },
    populateAllDepartments: (state, action) => {
      state.allDepartments = action.payload;
    },
    populateAllVendors: (state, action) => {
      state.allVendors = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setDraftStateAction,
  populateAllCategory,
  populateAllProjects,
  populateAllVendors,
  populateAllDepartments,
  populateAllVendorsCateroy,
} = procurementSlice.actions;

export default procurementSlice.reducer;
