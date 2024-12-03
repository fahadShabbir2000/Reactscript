import { Observable, Frame, confirm } from '@nativescript/core';
import { GraphQLService } from '../../services/graphql.service';
import type { Estimate, Item, UpdateItem } from '../../types';
import { formatNumber } from '../../utils/formatters';

interface ExtendedItem extends Item {
  total: number;
  numberFormat: string;
}

export class EstimateEditViewModel extends Observable {
  private _estimate: Estimate;
  private _items: Item[] = [];
  private _basketItems: Item[] = [];
  private _isLoading = false;
  private graphqlService = GraphQLService.getInstance();

  constructor(estimateId: number) {
    super();
    this.loadEstimate(estimateId);
    this.initializeBasket();

    this.on(Observable.propertyChangeEvent, (propertyChangeData: any) => {
      if (propertyChangeData.propertyName === "quantity") {
        this.updateTotals();
      }
    });
  }

  private initializeBasket() {
    this._basketItems = [
      { id: 1001, sku: 'OIL-001', name: 'Engine Oil', quantity: 1, price: 2500 },
      { id: 1002, sku: 'FIL-001', name: 'Oil Filter', quantity: 1, price: 500 },
      { id: 1003, sku: 'BRK-001', name: 'Brake Pads', quantity: 1, price: 1500 },
      { id: 1004, sku: 'CLN-001', name: 'Cleaning Kit', quantity: 1, price: 800 },
      { id: 1005, sku: 'PLG-001', name: 'Spark Plug', quantity: 1, price: 400 }
    ];
    this.notifyPropertyChange('basketItems', this._basketItems);
  }

  async loadEstimate(estimateId: number) {
    try {
      this._isLoading = true;
      this.notifyPropertyChange('isLoading', true);

      const result = await this.graphqlService.getEstimate(estimateId);
      if (result && result.estimate) {
        this._estimate = result.estimate;
        this._items = result.estimate.items.map(item => ({ ...item }));
        
        this.notifyPropertyChange('estimate', this._estimate);
        this.notifyPropertyChange('items', this.items);
        this.notifyPropertyChange('totalAmount', this.totalAmount);
      }
    } catch (error) {
      console.error('Failed to load estimate:', error);
    } finally {
      this._isLoading = false;
      this.notifyPropertyChange('isLoading', false);
    }
  }

  get items(): ExtendedItem[] {
    return this._items.map(item => ({
      ...item,
      total: item.price * item.quantity,
      numberFormat: formatNumber(item.price)
    }));
  }

  get basketItems(): Item[] {
    return this._basketItems;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get totalAmount(): number {
    return this._items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get numberFormat(): string {
    return formatNumber(this.totalAmount);
  }

  private updateTotals() {
    this.notifyPropertyChange('items', this.items);
    this.notifyPropertyChange('totalAmount', this.totalAmount);
    this.notifyPropertyChange('numberFormat', this.numberFormat);
  }

  deleteItem(id: number) {
    if (!id) return;

    confirm({
      title: "Move to Basket",
      message: "Do you want to move this item to the basket?",
      okButtonText: "Yes",
      cancelButtonText: "No"
    }).then(result => {
      if (result) {
        const index = this._items.findIndex(i => i.id === id);
        if (index !== -1) {
          const removedItem = this._items.splice(index, 1)[0];
          if (!this._basketItems.find(b => b.id === removedItem.id)) {
            this._basketItems.push({ ...removedItem, quantity: 1 });
          }
          this.notifyPropertyChange('items', this.items);
          this.notifyPropertyChange('basketItems', this._basketItems);
          this.updateTotals();
        }
      }
    });
  }

  addToItems(id: number) {
    if (!id) return;

    const basketItem = this._basketItems.find(item => item.id === id);
    if (basketItem) {
      this._items.push({ ...basketItem });
      
      const basketIndex = this._basketItems.findIndex(b => b.id === id);
      if (basketIndex !== -1) {
        this._basketItems.splice(basketIndex, 1);
      }
      
      this.notifyPropertyChange('items', this.items);
      this.notifyPropertyChange('basketItems', this._basketItems);
      this.updateTotals();
    }
  }

  async saveChanges() {
    try {
      this._isLoading = true;
      this.notifyPropertyChange('isLoading', true);

      const updateItems: UpdateItem[] = this._items.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));

      await this.graphqlService.updateEstimateItems(this._estimate.id, updateItems);
      Frame.topmost().goBack();
    } catch (error) {
      console.error('Failed to save changes:', error);
    } finally {
      this._isLoading = false;
      this.notifyPropertyChange('isLoading', false);
    }
  }
}