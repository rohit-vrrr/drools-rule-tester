import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MenuItem } from 'primeng/api';
import { Message } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { ContainerService } from 'src/app/services/container.service';
import { ProcessService } from 'src/app/services/process.service';
import { ProcessImagesService } from 'src/app/services/processImages.service';

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
  from: any;
  to: any;
  type: any;
  disabled: boolean = true;
  processInstanceId: any = undefined;
  processHistory: any[] = [];
  msg: Message[];

  processDefinitionSvg: any;
  processInstanceSvg: any;

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

    if(this.selectedContainer && this.selectedProcess) {
      console.log("Both Selected!!");
    }
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
      this.disabled = false;
    } else {
      this.processDefinitionSvg = undefined;
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

  handleSubmit() {
    this.clear();
    let reqBody: any = {};
    reqBody.From = this.from;
    reqBody.To = this.to;
    reqBody.Type = this.type;

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
    let obj: any = {};
    this.processService.getProcessHistory(
      this.selectedContainer?.['container-id'],
      this.processInstanceId
      ).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          history = res.body?.['variable-instance'];
          history.forEach((val: any) => {
            switch (val.name) {
              case 'From':
                obj.From = val.value;
                break;
              case 'To':
                obj.To = val.value;
                break;
              case 'Type':
                obj.Type = val.value;
                break;
              case 'isValid':
                obj.isValid = val.value;
                break;
              case 'finalResult':
                obj.processInstanceId = val?.['process-instance-id'];
                obj.finalResult = val.value;
                break;
            }
          });
          this.processHistory.push(obj);
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
    this.processHistory = [];
    this.processInstanceSvg = undefined;
  }
}
