import { Observable } from '@nativescript/core';

export class PdfViewerViewModel extends Observable {
  constructor(private _pdfUrl: string, private _title: string) {
    super();
  }

  get pdfUrl(): string {
    return this._pdfUrl;
    console.log(this._pdfUrl);
    return "https://4bff-39-61-50-47.ngrok-free.app/media/testhassab.pdf";
  }

  get title(): string {
    return this._title;
  }
}