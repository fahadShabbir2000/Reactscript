import { Observable, Frame, Utils, Application } from '@nativescript/core';
import { GraphQLService } from '../../services/graphql.service';
import type { Estimate } from '../../types';
import { formatNumber } from '../../utils/formatters';
import { TNSPlayer } from 'nativescript-audio';

export class EstimateDetailViewModel extends Observable {
  private _estimate: Estimate | null = null;
  private _items: any[] = [];
  private _isLoading = false;
  private _isPlaying = false;
  private graphqlService = GraphQLService.getInstance();
  private audioPlayer = new TNSPlayer();

  constructor(private estimateId: number) {
    super();
    this.loadEstimate();
  }

  async loadEstimate() {
    try {
      this._isLoading = true;
      this.notifyPropertyChange('isLoading', this._isLoading);

      const result = await this.graphqlService.getEstimate(this.estimateId);
      this._estimate = result.estimate;
      this._items = this._estimate.items.map(item => ({
        ...item,
        numberFormat: formatNumber(item.price)
      }));

      this.notifyPropertyChange('estimate', this.estimate);
      this.notifyPropertyChange('items', this._items);
    } catch (error) {
      console.error('Failed to load estimate:', error);
    } finally {
      this._isLoading = false;
      this.notifyPropertyChange('isLoading', this._isLoading);
    }
  }

  get estimate(): Estimate & { numberFormat: string } {
    return this._estimate ? {
      ...this._estimate,
      numberFormat: formatNumber(this.calculateTotal())
    } : null;
  }

  get items(): any[] {
    return this._items;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  private calculateTotal(): number {
    return this._estimate ? this._estimate.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0) : 0;
  }

  openMaps() {
    if (this._estimate && this._estimate.location) {
      const location = JSON.parse(this._estimate.location);
      const url = this._estimate.location;
      Utils.openUrl(url);
    }
  }

  openPdf() {
    if (this._estimate && this._estimate.pdfUrl) {
      Frame.topmost().navigate({
        moduleName: 'views/pdf-viewer/pdf-viewer-page',
        context: { 
          pdfUrl: this._estimate.pdfUrl,
          title: `Estimate #${this._estimate.id}`
        }
      });
    }
  }

  async confirmEstimate() {
    try {
      this._isLoading = true;
      this.notifyPropertyChange('isLoading', true);
      
      await this.graphqlService.updateMechanicStatus(this._estimate.id, true);
      await this.loadEstimate();
      
      Frame.topmost().goBack();
    } catch (error) {
      console.error('Failed to confirm estimate:', error);
    } finally {
      this._isLoading = false;
      this.notifyPropertyChange('isLoading', false);
    }
  }

  async toggleVoiceNote() {
    if (!this._estimate || !this._estimate.voiceNote) {
      console.error('No voice note available for this estimate.');
      return;
    }

    try {
      if (this._isPlaying) {
        await this.audioPlayer.pause();
        this._isPlaying = false;
        this.notifyPropertyChange('isPlaying', this._isPlaying);
      } else {
        if (!this.audioPlayer.isAudioPlaying()) {
          await this.audioPlayer.playFromUrl({
            audioFile: this._estimate.voiceNote,
            loop: false,
            completeCallback: () => {
              this._isPlaying = false;
              this.notifyPropertyChange('isPlaying', this._isPlaying);
            },
            errorCallback: (error) => {
              console.error('Error playing audio:', error);
            },
          });
          this._isPlaying = true;
          this.notifyPropertyChange('isPlaying', this._isPlaying);
        }
      }
    } catch (error) {
      console.error('Error toggling voice note playback:', error);
    }
  }

  editEstimate() {
    Frame.topmost().navigate({
      moduleName: 'views/estimate-edit/estimate-edit-page',
      context: { estimateId: this._estimate.id }
    });
  }
}