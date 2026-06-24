import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  private http = inject(HttpClient)
  private apiurl = environment.apiUrl;

  public dashboardstate(): Observable<any> {
    return this.http.get(`${this.apiurl}/Dashboard`)
  }
}
