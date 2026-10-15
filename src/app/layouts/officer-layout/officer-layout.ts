
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { OfficerHeader } from '../../shared/components/officer-header/officer-header';
import { OfficerSidebar } from '../../shared/components/officer-sidebar/officer-sidebar';

@Component({
  selector: 'app-officer-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    OfficerHeader,
    OfficerSidebar
  ],
  templateUrl: './officer-layout.html',
  styleUrl: './officer-layout.css'
})
export class OfficerLayout {}
