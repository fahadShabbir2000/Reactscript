import { NavigatedData, Page } from '@nativescript/core';
import { EstimatesViewModel } from './estimates-view-model';

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  page.bindingContext = new EstimatesViewModel();
}