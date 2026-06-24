import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NoticeService {
  private apiurl = `${environment.apiUrl}/Notices`;
  private http = inject(HttpClient);

  getNotices(pageNo: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiurl}?pageNumber=${pageNo}&pageSize=${pageSize}`);
  }

  addNotice(notice: any): Observable<any> {
    return this.http.post(this.apiurl, notice);
  }

  updateNotice(notice: any): Observable<any> {
    return this.http.put(this.apiurl, notice);
  }

  deleteNotice(id: string): Observable<any> {
    return this.http.delete(`${this.apiurl}/${id}`);
  }
}
