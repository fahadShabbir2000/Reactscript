import { Application } from '@nativescript/core';
import { DummyDataService } from './services/dummy-data.service';

// Initialize dummy data
DummyDataService.init();

Application.run({ moduleName: 'app-root' });