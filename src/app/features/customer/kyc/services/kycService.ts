
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KycService {

  private apiUrl = 'http://localhost:8080/api/v1/kyc';

  constructor(private http: HttpClient) {}

  uploadDocument(customerId: number, documentType: string, file: File): Observable<any> {
    const formData = new FormData();

    formData.append('customerId', customerId.toString());
    formData.append('documentType', documentType);
    formData.append('file', file);

    return this.http.post<any>(`${this.apiUrl}/upload`, formData);
  }

  getDocuments(customerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/customer/${customerId}`);
  }

  viewDocument(documentId: number): string {
    return `${this.apiUrl}/document/${documentId}`;
  }
}
