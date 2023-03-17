import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessImagesService {
  headers: any;
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Authorization': "Basic YWRtaW46YWRtaW4="});
  }

  retrieveProcessDefinitionSvg(containerId: string, processId: string) {
    return this.http.get(
      environment.baseURL + '/server/containers/' + containerId +
      '/images/processes/' + processId,
      { headers: this.headers, responseType: 'text', observe: 'response' }
    );
  }

  retrieveProcessInstanceSvg(containerId: string, processInstanceId: number) {
    return this.http.get(
      environment.baseURL + '/server/containers/' + containerId +
      '/images/processes/instances/' + processInstanceId +
      '?svgCompletedColor=%23C0C0C0&svgCompletedBorderColor=%23030303&svgActiveBorderColor=%231e90ff&svgInstanceBadgesShow=false&svgActiveAsyncBorderColor=%23FF0000',
      { headers: this.headers, responseType: 'text', observe: 'response' }
    );
  }
}
