import { NavigatedData, Page } from '@nativescript/core';
import { PdfViewerViewModel } from './pdf-viewer-view-model';

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  const context = args.context as { pdfUrl: string; title: string };
  page.bindingContext = new PdfViewerViewModel(context.pdfUrl, context.title);
}