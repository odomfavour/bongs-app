export interface User {
    first_name: string;
    last_name: string;
  }
  
 export interface Barge {
    id: number;
    barge_number: string;
    name: string;
    rooms: number;
    store_location: number;
    deck_level: number;
    addedBy: string;
    created_at: string;
    status: string;
    user: User;
  }
  
  export interface Project {
    id: number;
    project_name: string;
    project_title: string;
    project_duration: string;
    project_start_date: string;
    project_end_date: string;
    created_at: string;
  }
  
  export interface Deck {
    id: number;
    deck_number: string;
    name: string;
    deck_type: string;
    barge: Barge;
    user: User;
    created_at: string;
    status: string;
  }

  interface DeckStoreType {
    id: number;
    deck_number: string;
    name: string;
    deck_type: string;
    created_at: string;
    status: string;
  }
  
  export interface DeckType {
    id: number;
    deck_number: string;
    name: string;
    deck: Deck;
    barge: Barge;
    type: string;
    user: User;
    created_at: string;
    status: string;
  }
  
  export interface StoreBoardType {
    id: number;
    project: Project;
    description: string;
    deck: DeckStoreType;
    key: string;
    room_number: string;
    addedBy: string;
    created_at: string;
    status: string;
    user: User;
  }

  interface ProjectManagerType {
    id: number;
    first_name: string;
    last_name: string;
  }

  export interface ProjectType {
    id: number;
    project_name: string;
    project_title: string;
    project_duration: string;
    project_start_date: string;
    project_end_date: string;
    project_manager: ProjectManagerType;
    created_at: string;
  }

/* dashboard types */
  
export interface DashboardCardType { 

  stockCountAmount: number,
  stockCountPercent: number,


  inventoryAmount: number,
  sparePartInventory: number,
  consumablesInventory: number,


  materialRequisitionAmount: number,
  materialReleasedPercentageChange: number,

 
   materialReceivedAmount: number,
  materialReceivedPercent: number,

  mivSperePart: number,
  mivConsumables: number,
  mivAmount: number,

  totalMaterialRequisition: number,
  totalMaterialRequisitionApproved: number,

}



export type updateDraftProcurementType = {
  subscriber_id: number,
  procurement_id: number,
  project_id?: number,
  title: string,
  procurement_type: string,
  client_project_department: string,
  vendor_category_id?: number,
  budget: number,
  currency:string,
  delivery_date?: string,
  bidding_deadline: string,
  vendors?: number[]
}




export interface consumableCountType{
  Deck: number,
  Engine: number,
  GalleyLaundry: number,
  Hospital: number, 
  Safety:number
}


export interface sparePartCountType {
  Deck: string, 
  Hospital: string,
  Engine: string,
  Safety: string

}
export interface BarchartPropType {
  consumable_counts: consumableCountType,
  spare_part_counts: sparePartCountType 
}


export interface categoryCountType {
  DeckConsumable: any,
  EngineConsumable: any,
  GalleyLaundryConsumable: any,
  HospitalConsumable: any,
  SafetyConsumable: any,
  SparePartDeck: any,
  SparePartEngine: any,
  SparePartHospital: any,
  SparePartSafety: any
  
}
 

export interface UserType {
  first_name: string;
  last_name: string;
}

export interface UomType {
  id: number;
  name: string;
  unit: string;
  description: string;
  addedBy: string;
  status: string;
  created_at: string;
  user: User;
}

export interface UoMListTablePropsType {
  data: UomType[];
  fetchData: () => void;
  setOpenModal: (isOpen: boolean) => void;
}



export interface SafetyCategoryType {
  id: number;
  name: string;
  safety_number: string;
  description: string;
  addedBy: string;
  status: string;
  user: User;
  created_at: string;
}

export interface SafetyCategoryListTableProps {
  data: SafetyCategoryType[];
  fetchData: () => void; // Add a function to refresh the data
  setOpenModal: (isOpen: boolean) => void;
}




  
export interface DeckType {
  id: number;
  name: string;
  deck_number: string;
  deck_type: string;
}

export interface LocationType {
  id: number;
  name: string;
  location_number: string;
  address: string;
  deck: DeckType;
  status: string;
  created_at: string;
}

export interface LocationListTablePropsType {
  data: Location[];
  fetchData: () => void;
  setOpenModal: (isOpen: boolean) => void;
}

export interface signMostUsedItemProp{ 
  category_name: string,
  count: number
}
export interface mostUsedInventoryPropType {
  data: signMostUsedItemProp[] | []
}

export type draftListType = {
  stock_quantity: number,
  description: string,
  attachments: any
}[]


export type dratfProcurementType  = {
  title: string,
  draftList: draftListType 
}




export type creactNewBidApiType = {
subscriber_id: number,
request_for_quotation_id: number,
vendor_email: string,
 vendor: string,
 cost: number,
 currency: string,
 from_delivery_date?: string,
 delivery_date: string,
 validity_period_to: string,
 payment_term: number,
  bid_items: any,
  subTotal: number,
  balance: number,
 
//  bid_items: {
//   quantity: number,
//   name: string, 
//   unitPrice: number,
//   currency?: string

//  }[],
 bid_files: string[]


}