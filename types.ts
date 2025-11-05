export enum ConservationState {
  Bueno = 'BUENO',
  Regular = 'REGULAR',
  Malo = 'MALO',
}

// Represents the definition of an item type (e.g., "HP Probook Laptop").
export interface ItemTemplate {
  id: string;
  assetCode: string;
  name: string;
  brand: string;
  model: string;
  type: string;
  color: string;
  dimensions: string;
  other: string;
  origin: string;
}

// Represents a specific, physical instance of an item template.
export interface InventoryItem {
  id: string;
  posision: number;
  templateId: string; // Links to an ItemTemplate
  location: string;
  serial: string; // Serial number is unique to the instance
  situation: string;
  conservationState: ConservationState | string;
  observations?: string;
}


export interface Location {
  id: string;
  name: string;
}
