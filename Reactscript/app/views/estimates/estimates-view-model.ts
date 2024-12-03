import { Observable, Frame, ItemEventData } from '@nativescript/core';
import { GraphQLService } from '../../services/graphql.service';
import type { Estimate } from '../../types';
import { formatDate, formatNumber } from '../../utils/formatters';

export class EstimatesViewModel extends Observable {
  private _estimates: Estimate[] = [];
  private _isLoading = false;
  private graphqlService = GraphQLService.getInstance();

  constructor() {
    super();
    this.loadEstimates();
  }

  get estimates(): (Estimate & { 
    dateFormat: string; 
    numberFormat: string; 
    totalAmount: number 
  })[] {
    return this._estimates.map(estimate => ({
      ...estimate,
      dateFormat: formatDate(estimate.appointmentTime),
      numberFormat: formatNumber(this.calculateTotal(estimate)),
      totalAmount: formatNumber(estimate.total),
    }));
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  private calculateTotal(estimate: Estimate): number {
    return estimate.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  async loadEstimates() {
    try {
      this._isLoading = true;
      this.notifyPropertyChange('isLoading', this._isLoading);

      const result = await this.graphqlService.getEstimates();
      this._estimates = result.estimates.sort((a, b) => 
        new Date(b.appointmentTime).getTime() - new Date(a.appointmentTime).getTime()
      );
      
      this.notifyPropertyChange('estimates', this.estimates);
    } catch (error) {
      console.error('Failed to load estimates:', error);
    } finally {
      this._isLoading = false;
      this.notifyPropertyChange('isLoading', this._isLoading);
    }
  }

  onItemTap(args: ItemEventData) {
    const tappedItem = this.estimates[args.index];
    if (tappedItem && tappedItem.id) {
      Frame.topmost().navigate({
        moduleName: 'views/estimate-detail/estimate-detail-page',
        context: { estimateId: tappedItem.id }
      });
    }
  }
}