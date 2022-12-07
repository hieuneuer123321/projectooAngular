import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { WizardComponent } from 'angular-archwizard';
import { GeneralService } from 'src/app/services/general.service';
import { DatePipe } from '@angular/common';
import { ApiservicesService } from 'src/app/services/api.service';
import { EventSample } from 'src/app/Model/Event_Sample';
import * as moment from 'moment';
@Component({
  selector: 'app-new-event-sample',
  templateUrl: './new-event-sample.component.html',
  styleUrls: ['./new-event-sample.component.css'],
})
export class NewEventSampleComponent implements OnInit {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  evenSample = new EventSample();
  dateStart = new Date();
  dateEnd = new Date();
  hourStart: any;
  hourEnd: any;
  locationListAll;
  name = 'Angular ';
  today = Date.now();
  wizardStep = 0;
  spinnerLoading = false;
  newEventData = {
    start: '',
    end: '',
    description: '',
    location: '',
    invited: '',
    note: '',
    file: [],
  };
  chosenAssigneelList: any[] = [];
  allUserInStep2List;
  majorAssignee;
  groupKeyChosenInStep2 = 'all';
  constructor(
    private _location: Location,
    public generalService: GeneralService,
    public api: ApiservicesService
  ) {}

  ngOnInit(): void {
    console.log(this.wizardStep);
    this.onAsigneeGroupChange(null);
    console.log(this.generalService);
    this.dualListUpdateForAssignee(null);
    this.getListLocationAll();

    // Wed, 22 Dec 2021 00:31:25 GMT

    // T4 ngày 22/12/2021
  }

  async getListLocationAll() {
    try {
      this.locationListAll = await this.api.httpCall(
        this.api.apiLists.GetAllLocations,
        {},
        {},
        'get',
        true
      );
      // console.log(this.locationListAll.length);
    } catch (e) {
      console.log(e.message);
    }
  }
  goBack() {
    this._location.back();
  }
  onAsigneeGroupChange(e) {
    console.log(this.groupKeyChosenInStep2);
    console.log(e);
    if (e == null || this.groupKeyChosenInStep2 == 'all') {
      this.allUserInStep2List = this.generalService.cloneAnything(
        this.generalService.allUsers
      );
    } else {
      this.allUserInStep2List = this.generalService.allUsersWithGroups[`${e}`];
    }
  }
  onChange(e: any) {
    this.onAsigneeGroupChange(e);
  }
  onChangeUser(e: any) {
    console.log(e);
  }
  dualListUpdateForAssignee(event) {
    console.log(event);
    if (event) {
      this.allUserInStep2List = event.leftList;
      this.chosenAssigneelList = event.rightList;
      this.evenSample.dsLienQuan = event.rightList;
    } else {
      this.chosenAssigneelList = [];
    }
    console.log(this.chosenAssigneelList);
    // if (this.groupKeyChosenInStep2 == 'all') {
    //   for (let i = 0; i < this.allUserInStep2List.length; ++i) {
    //     if (
    //       !this.containsObject(
    //         this.allUserInStep2List[i],
    //         this.generalService.allUsers
    //       )
    //     )
    //       this.allUserInStep2List.splice(i, 1);
    //   }
    // } else {
    //   for (let i = 0; i < this.allUserInStep2List.length; ++i) {
    //     if (
    //       !this.containsObject(
    //         this.allUserInStep2List[i],
    //         this.generalService.allUsersWithGroups[
    //           `${this.groupKeyChosenInStep2}`
    //         ]
    //       )
    //     )
    //       this.allUserInStep2List.splice(i, 1);
    //   }
    // }
    //kiem tra xem majorAssignee đã chọn trước đó còn trong list chosen hay ko.
    // if (this.majorAssignee != null) {
    //   let check = false;
    //   for (let i = 0; i < this.chosenAssigneelList.length; ++i) {
    //     if (this.majorAssignee == this.chosenAssigneelList[i]) {
    //       check = true;
    //       break;
    //     }
    //   }
    //   if (!check) this.majorAssignee = null;
    // }
  }
  removeFile(index) {
    this.newEventData.file.splice(index, 1);
    const dt = new DataTransfer();
    const input = document.getElementById('fileList') as HTMLInputElement;
    const { files } = input;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (index !== i) dt.items.add(file); // here you exclude the file. thus removing it.
    }

    input.files = dt.files;
  }
  handleFileInput(files: FileList) {
    this.newEventData.file = Array.from(files);
    console.log(files);
  }
  wizardGoodToGo(numb) {
    this.wizard.goToStep(numb);
  }
  finish() {}
  async addEventSample() {
    console.log(typeof this.dateStart);
    const date = new Date(this.dateStart);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    const dateStartConvert = new Date(year, month, day, hour, minutes);
    console.log(typeof dateStartConvert);
    this.evenSample.tgbatdau = dateStartConvert;
    this.evenSample.tgketthuc = `${this.dateEnd} ${this.hourEnd}`;

    console.log(this.evenSample);
    try {
      await this.api.httpCall(
        this.api.apiLists.AddNewEventSample,
        {},
        this.evenSample,
        'post',
        true
      );
    } catch (e) {
      console.log(e.message);
    }
  }
}
