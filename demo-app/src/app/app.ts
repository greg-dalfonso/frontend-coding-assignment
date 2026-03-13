import { Component } from '@angular/core';
import { JobDescriptions } from './features/job-descriptions/job-descriptions';

@Component({
  selector: 'app-root',
  imports: [JobDescriptions],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
