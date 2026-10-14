
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-header.html',
  styleUrl: './customer-header.css'
})
export class CustomerHeader {

  notificationCount = 0;

  onNotificationsClick(): void {
    // Connect this to the notification panel/API later.
    console.log('Notifications clicked');
  }

  onProfileClick(): void {
    // Connect this to the customer profile menu later.
    console.log('Profile clicked');
  }
}