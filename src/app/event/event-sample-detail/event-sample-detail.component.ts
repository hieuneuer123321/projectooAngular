import { Component, ElementRef, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { HttpClient } from '@angular/common/http';
import data from '../event-sample/event-sample.language';
import { Location } from '@angular/common';
import { ApiservicesService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-event-sample-detail',
  templateUrl: './event-sample-detail.component.html',
  styleUrls: ['./event-sample-detail.component.css'],
})
export class EventSampleDetailComponent implements OnInit {
  eventSampleData;
  sampleDataDetail;
  spinnerLoading = false;
  config;
  constructor(
    private httpClient: HttpClient,
    private el: ElementRef,
    public generalService: GeneralService,
    private router: Router,
    private _location: Location,
    private api: ApiservicesService,
    public routerAc: ActivatedRoute
  ) {}
  goBack() {
    this._location.back();
  }
  ngOnInit(): void {
    this.getById(this.routerAc.snapshot.params['id']);
  }
  // ngOnInit() {
  //   this.getUserById(this.router.snapshot.params['userId']);
  //   this.UserService.currentMessage.subscribe(
  //     (message) => (this.message = message)
  //   );
  // }
  // getUserById(id: string) {
  //   this.UserService.getUsers(id).subscribe((data: any) => {
  //     this.User = data;
  //     // this.username = data.username;
  //     console.log(this.User);
  //   });
  // }
  getLabel(key) {
    return data[`${this.generalService.currentLanguage.Code}`][`${key}`];
  }

  async getById(id: string) {
    console.log(id);
    this.sampleDataDetail = await this.api.httpCall(
      this.api.apiLists.GetEventDetailById,
      {},
      { ltid: id },
      'get',
      true
    );
  }

  async gData() {
    try {
      let apiData: any;
      this.eventSampleData = await this.api.httpCall(
        this.api.apiLists.GetAllEventSample,
        {},
        {},
        'get',
        true
      );
    } catch (e) {
      console.log(e.message);
    }
  }
}
