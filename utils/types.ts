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

  

 




  