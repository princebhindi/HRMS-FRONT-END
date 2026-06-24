import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiurl = `${environment.apiUrl}/User`;
  private http = inject(HttpClient);

  getUsers(): Observable<any> {
    return this.http.get(this.apiurl);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiurl}/${id}`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(this.apiurl, user);
  }
}
