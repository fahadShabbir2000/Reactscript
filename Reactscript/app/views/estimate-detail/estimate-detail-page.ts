import { NavigatedData, Page } from '@nativescript/core';
import { EstimateDetailViewModel } from './estimate-detail-view-model';

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  const context = args.context as { estimateId: number };
  
  if (context && context.estimateId) {
    page.bindingContext = new EstimateDetailViewModel(context.estimateId);
  }
}