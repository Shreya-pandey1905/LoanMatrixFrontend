
import { Component } from '@angular/core';

@Component({
  selector: 'app-officer-header',
  standalone: true,
  imports: [],
  templateUrl: './officer-header.html',
  styleUrl: './officer-header.css'
})
export class OfficerHeader {
  officerName = 'Loan Officer';
  pageTitle = 'Officer Portal';
}
