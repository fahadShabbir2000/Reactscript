export interface Item {
  id: number;
  sku: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Estimate {
  id: number;
  customerName: string;
  contactNumber: string;
  address: string;
  location: string;
  appointmentTime: string;
  voiceNote?: string;
  mechanicStatus: string;
  pdfUrl?: string;
  items: Item[];
}

export interface UpdateItem {
  id: number;
  quantity: number;
}