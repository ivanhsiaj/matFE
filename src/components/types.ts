// src/types.ts
export interface MaterialSubItem {
  _id: string;
  materialType: string;
  size: string;
  count: number;
  weightPerItem: number;
}

export interface MaterialEntry {
  _id: string;
  shift: string;
  employee: {
    _id: string;
    name: string;
  };
  timestamp: string;
  totalWeight: number;
  materials: MaterialSubItem[];
  furnaceSize?: string;
  outputStatus?: boolean;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  shiftAssigned: string;
}

export interface DischargeEntry {
  _id: string;
  shift: string;
  employee: {
    _id: string;
    name: string;
  };
  itemType: string;
  weight: number;
  sowId?: string;
  furnaceSize: string;
  materialEntry?: MaterialEntry;
  timestamp: string;
}