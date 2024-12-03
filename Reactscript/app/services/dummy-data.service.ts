import type { Estimate, BasketItem } from '../types';

export class DummyDataService {
  private static estimates: Estimate[] = [];
  private static basketItems: BasketItem[] = [];

  static init() {
    // Initialize dummy estimates
    this.estimates = [
      {
        id: '1',
        customerName: 'John Doe',
        contactNumber: '+92 300 1234567',
        address: 'Street 1, Block A, Lahore',
        location: {
          latitude: 31.5204,
          longitude: 74.3587
        },
        appointmentTime: '2024-03-20T10:00:00',
        status: 'pending',
        items: [
          { sku: 'OIL-001', name: 'Engine Oil', quantity: 1, price: 2500 },
          { sku: 'FIL-001', name: 'Oil Filter', quantity: 1, price: 500 }
        ]
      },
      {
        id: '2',
        customerName: 'Sarah Khan',
        contactNumber: '+92 300 7654321',
        address: 'Street 5, Block B, Karachi',
        location: {
          latitude: 24.8607,
          longitude: 67.0011
        },
        appointmentTime: '2024-03-20T14:00:00',
        status: 'pending',
        items: [
          { sku: 'TYR-001', name: 'Front Tire', quantity: 2, price: 3000 }
        ]
      }
    ];

    // Initialize dummy basket items
    this.basketItems = [
      { sku: 'BRK-001', name: 'Brake Pads', quantity: 1, price: 1500, isPreSelected: true },
      { sku: 'CLN-001', name: 'Cleaning Kit', quantity: 1, price: 800, isPreSelected: true },
      { sku: 'LUB-001', name: 'Chain Lube', quantity: 1, price: 300, isPreSelected: true },
      { sku: 'PLG-001', name: 'Spark Plug', quantity: 1, price: 400, isPreSelected: true },
      { sku: 'CHN-001', name: 'Chain Set', quantity: 1, price: 2500, isPreSelected: true }
    ];
  }

  static getEstimates(): Estimate[] {
    return this.estimates;
  }

  static getEstimateById(id: string): Estimate | undefined {
    return this.estimates.find(e => e.id === id);
  }

  static getBasketItems(): BasketItem[] {
    return this.basketItems;
  }

  static updateEstimate(id: string, updatedEstimate: Partial<Estimate>): void {
    const index = this.estimates.findIndex(e => e.id === id);
    if (index !== -1) {
      this.estimates[index] = { ...this.estimates[index], ...updatedEstimate };
    }
  }
}