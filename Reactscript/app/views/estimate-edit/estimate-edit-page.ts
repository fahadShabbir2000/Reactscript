import { NavigatedData, Page, EventData } from '@nativescript/core';
import { EstimateEditViewModel } from './estimate-edit-view-model';

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  const context = args.context as { estimateId: number };
  
  if (context && context.estimateId) {
    const vm = new EstimateEditViewModel(context.estimateId);
    page.bindingContext = vm;
  }
}