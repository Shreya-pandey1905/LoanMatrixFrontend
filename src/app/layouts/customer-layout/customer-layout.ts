
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CustomerHeader } from '../../shared/components/customer-header/customer-header';
import { CustomerSidebar } from '../../shared/components/customer-sidebar/customer-sidebar';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CustomerHeader,
    CustomerSidebar
  ],
  templateUrl: './customer-layout.html',
  styleUrl: './customer-layout.css'
})
export class CustomerLayout {}
