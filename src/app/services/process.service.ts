import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  headers: any;
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Authorization': "Basic YWRtaW46YWRtaW4="});
  }

  retrieveProcessVariables(containerId: string, processId: string) {
    return this.http.get(
      environment.baseURL + '/server/containers/' + containerId +
      '/processes/definitions/' + processId + '/variables',
      { headers: this.headers, observe: 'response' }
    );
  }

  listAllProcesses(containerId: any) {
    return this.http.get(
      environment.baseURL + '/server/queries/cases/' + containerId + '/processes',
      { headers: this.headers, observe: 'response' }
    );
  }

  startNewProcessInstance(containerId: string, processId: string, reqData: any) {
    return this.http.post(
      environment.baseURL + '/server/containers/' + containerId +
      '/processes/' + processId + '/instances/correlation/' + environment.correlationKey,
      reqData,
      { headers: this.headers, observe: 'response' }
    );
  }

  getProcessHistory(containerId: string, processInstanceId: number) {
    return this.http.get(
      environment.baseURL + '/server/containers/' + containerId +
      '/processes/instances/' + processInstanceId + '/variables/instances',
      { headers: this.headers, observe: 'response' }
    );
  }
}
