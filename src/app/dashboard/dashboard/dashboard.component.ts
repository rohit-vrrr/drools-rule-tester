import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MenuItem } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { ContainerService } from 'src/app/services/container.service';
import { ProcessService } from 'src/app/services/process.service';
import { ProcessImagesService } from 'src/app/services/processImages.service';

import { camelCase } from 'lodash';
import { startCase } from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  menuItems: MenuItem[];
  visibleSidebar: boolean;
  kieContainers: any[];
  selectedContainer: any;
  allProcesses: any = undefined;
  selectedProcess: any;
  disabled: boolean = true;
  processVariablesJSON: any[] = [];
  processInstanceId: any = undefined;
  processHistory: any = {};
  processHistoryKeys: any[] = [];
  processHistoryValues: any[] = [];
  msg: Message[];

  processDefinitionSvg: any;
  processInstanceSvg: any;

  startCase = startCase;

  constructor(
    private primengConfig: PrimeNGConfig,
    private containerService: ContainerService,
    private processService: ProcessService,
    private processImagesService: ProcessImagesService,
    private sanitizer: DomSanitizer
  ) {
    this.containerService.listAllContainers().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.kieContainers = res.body.result?.['kie-containers']?.['kie-container'];
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Drools Rule Tester',
        icon: "pi pi-angle-double-right",
        command: () => this.showSidebar()
      }
    ];
    this.primengConfig.ripple = true;
  }

  onContainerIdChange() {
    if (this.selectedContainer != null && this.selectedContainer != undefined) {
      this.getAllProcesses();
    } else this.allProcesses = undefined;
  }

  onProcessIdChange() {
    if (this.selectedProcess != null && this.selectedProcess != undefined) {
      this.getProcessDefinitionDiagram();
      this.getProcessVariables();
      this.disabled = false;
    } else {
      this.processDefinitionSvg = undefined;
      this.processVariablesJSON = [];
      this.disabled = true;
    }
  }

  getAllProcesses() {
    this.processService.listAllProcesses(this.selectedContainer?.['container-id']).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.allProcesses = res.body.processes;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getProcessDefinitionDiagram() {
    this.processImagesService.retrieveProcessDefinitionSvg(
      this.selectedContainer?.['container-id'],
      this.selectedProcess?.['process-id']
      ).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.processDefinitionSvg = this.sanitizer.bypassSecurityTrustHtml(res.body);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getProcessInstanceDiagram() {
    this.processImagesService.retrieveProcessInstanceSvg(
      this.selectedContainer?.['container-id'],
      this.processInstanceId
    ).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.processInstanceSvg = this.sanitizer.bypassSecurityTrustHtml(res.body);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getProcessVariables() {
    this.processService.retrieveProcessVariables(
      this.selectedContainer?.['container-id'],
      this.selectedProcess?.['process-id'],
    ).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.renderprocessVariables(Object.keys(res.body?.variables));
        }
      },
      error: (err) => {
        this.showErrorMessage();
      }
    });
  }

  renderprocessVariables(varArr: any) {
    varArr.forEach((v: any) => {
      this.processVariablesJSON.push({
        type: 'text',
        name: camelCase(v),
        label: startCase(v),
        value: ''
      });
    });
  }

  dynamicFormOnChange(event: any) {
    this.processVariablesJSON.forEach((v: any) => {
      if (v.name === event.target.name) {
        v.value = event.target.value;
      }
    });
  }

  dynamicFormSubmit() {
    this.clear();
    let reqBody: any = {};
    
    this.processVariablesJSON.forEach((v: any) => {
      reqBody[v.name] = v.value;
    });

    this.processService.startNewProcessInstance(
      this.selectedContainer?.['container-id'],
      this.selectedProcess?.['process-id'],
      reqBody
      ).subscribe({
      next: (res) => {
        if (res.status === 201) {
          this.processInstanceId = res.body;
          this.showSuccessMessage(res.body);
          this.getProcessHistory();
          this.getProcessInstanceDiagram();
        }
      },
      error: (err) => {
        this.showErrorMessage();
      }
    });
  }

  getProcessHistory() {
    let history: any;
    this.processService.getProcessHistory(
      this.selectedContainer?.['container-id'],
      this.processInstanceId
      ).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          history = res.body?.['variable-instance'];
          history.forEach((val: any) => {
            this.processHistory[val.name] = val.value;
          });

          this.processHistoryKeys = Object.keys(this.processHistory);
          this.processHistoryValues = Object.values(this.processHistory);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  showSidebar() {
    this.visibleSidebar = true;
  }

  showSuccessMessage(id: any) {
    this.msg = [
      {severity:'success', summary:'Success', detail:`ProcessInstanceId: ${id}`}
    ];
  }

  showErrorMessage() {
    this.msg = [
      {severity:'error', summary:'Error', detail:'Unable to create response!'}
    ];
  }

  clear() {
    this.processInstanceId = undefined;
    this.processHistory = {};
    this.processInstanceSvg = undefined;
  }
}
