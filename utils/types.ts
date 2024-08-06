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
  totalApprovedMaterial: number,

 
   materialReceivedAmount: number,
  materialReceivedPercent: number,

  mivSperePart: number,
  mivConsumables: number,
  mivAmount: number,

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


/* 


DeckConsumable
: 
{Paintings: 0, Greases: 0, Ropes: 0, Peripherials: 0}
EngineConsumable
: 
{Electrical: 0, Mechanical: 0, Pnuematic: 0, Hydraulic: 0, Oils & Greases: 0, …}
GalleyLaundryConsumable
: 
{Mess: 0, Kitchen: 0, Laundry: 0}
HospitalConsumable
: 
{Drugs: 0, Injections: 0}
SafetyConsumable
: 
{Main Deck: 0, Auxillary: 0}
SparePartDeck
: 
{radar: 0, radios: 0, monitors, tvs, printers: 0, ropes and wires: 0, brush and painting: 0}
SparePartEngine
: 
{generator: 0, huisman crane: 0, tensioner and A&R wrench: 0, davits: 0, lineup station: 0, …}
SparePartHospital
: 
{mattress/bed: 0, respirators: 0}
SparePartSafety

*/

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
 




  