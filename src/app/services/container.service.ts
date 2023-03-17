import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {
  headers: any;
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Authorization': "Basic YWRtaW46YWRtaW4="});
  }

  listAllContainers() {
    return this.http.get(
      environment.baseURL + '/server/containers',
      { headers: this.headers, observe: 'response' }
    );
  }
}
