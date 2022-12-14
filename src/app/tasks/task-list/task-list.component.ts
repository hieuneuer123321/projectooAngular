import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiservicesService } from 'src/app/services/api.service';
import { GeneralService } from 'src/app/services/general.service';
import data from './task-list.language';
import * as moment from 'moment';
declare var bootstrap: any
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  //currentAssignedTask
  //originalAssignedTask
  //currentForwardedTask
  //originalForwardedTask
  //currentWatchableTask
  //originalWatchableTask
  spinnerLoading = false
  currentTab = '0'
  originalTaskList
  taskList

  tutorials: any;
  currentTutorial = null;
  currentIndex = -1;
  searchKey = '';
  page = 0;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30];

  paginationConfig
  myModal

  constructor(private el: ElementRef, private api: ApiservicesService, public generalService: GeneralService, private router: Router) {
  }
  ngOnInit(): void {
    this.generateData();
    this.myModal = new bootstrap.Modal(document.getElementById('myModal'), {
      keyboard: false
    })
    console.log(this.myModal)
  }
  getLabel(key) {
    return data[`${this.generalService.currentLanguage.Code}`][`${key}`]
  }

  async generateData() {
    this.spinnerLoading = true
    let options = {
      PageNumber: this.page,
      PageSize: this.pageSize,
      isPaging: true
    }
    try {
      let res
      let result
      res = await this.api.httpCall(this.api.apiLists.getTasks + this.currentTab, {}, options, 'get', true);
      result = <any>res
      this.originalTaskList = this.updateProgressInfoToList(result.data)
      this.taskList = Array.from(this.originalTaskList)
      this.count = result.totalRecords
      this.paginationConfig = {
        id: 'paginationControl',
        itemsPerPage: this.pageSize,
        currentPage: this.page,
        totalItems: this.count
      }
      this.spinnerLoading = false;
    } catch (error) {
      this.spinnerLoading = false
      this.myModal.toggle()
    }
  }
  openNewTaskModal() {
    console.log('new task')
    this.router.navigate(['/tasks/new-task']);
  }
  handlePageChange(event): void {
    this.page = event;
    this.generateData();
  }
  handlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = 0;
    this.generateData();
  }
  search() {
    if (this.originalTaskList != null) {
      let self = this;
      if (this.searchKey != '')
        this.taskList = this.originalTaskList.filter(function (v, i) {
          if (self.removeAccents(v.chude.toLowerCase()).indexOf(self.removeAccents(self.searchKey)) >= 0
            || self.removeAccents(v.nguoiTaoHoTen.toLowerCase()).indexOf(self.removeAccents(self.searchKey)) >= 0) {
            return true;
          } else false;
        });
      else
        this.taskList = Array.from(this.originalTaskList)
    }
  }
  taskItemClick(task) {
    console.log(task);
    let taskid = task.mscv;
    this.router.navigateByUrl(`/tasks/task-detail/${taskid}`);
  }
  removeAccents(str) {
    var AccentsMap = [
      "a??????????????????????????????????????????????",
      "A??????????????????????????????????????????????",
      "d??", "D??",
      "e??????????????????????????????",
      "E??????????????????????????????",
      "i????????????",
      "I????????????",
      "o??????????????????????????????????????????????",
      "O??????????????????????????????????????????????",
      "u?????????????????????????????",
      "U?????????????????????????????",
      "y??????????????",
      "Y??????????????"
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
      var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }
  updateProgressInfoToList(list: [any]) {
    for (let i = 0; i < list.length; ++i) {
      list[i]['progressInfo'] = this.getProgressInfo(list[i].ngayBatDau, list[i].ngayKetThucDuKien, list[i].ngayKetThucThucTe);
    }
    return list;
  }
  getProgressInfo(start: string, stop: string, realEnd: string) {
    let realEndDate
    let displayText = ''
    let isLate = false;
    let percent = 100;
    let outerStrokeColor = '#78C000'
    let startDate = moment(start.split(' ')[0], 'DD-MM-YYYY')
    let endDate = moment(stop.split(' ')[0], 'DD-MM-YYYY')
    let today = moment().format('D MMM, YYYY');
    let hasTaskPastDue = endDate.diff(today, 'days', false);

    if (realEnd != null) {
      realEndDate = moment(realEnd.split(' ')[0], 'DD-MM-YYYY');
      hasTaskPastDue = endDate.diff(realEndDate, 'days', false);
      if (hasTaskPastDue < 0) {
        // task k???t th??c tr???
        isLate = true; percent = 100; outerStrokeColor = '#F7CA18';
        displayText = 'K???t th??c tr??? ' + Math.abs(hasTaskPastDue) + ' ng??y!'
      }
      else if (hasTaskPastDue >= 0) {
        // task k???t th??c ????ng h???n
        percent = 100; outerStrokeColor = '#FFBF47'
      }
    }
    else {
      if (hasTaskPastDue < 0) {
        // task qu?? h???n
        isLate = true; percent = 99; outerStrokeColor = '#FF6347';
        displayText = '???? qu?? h???n ' + Math.abs(hasTaskPastDue) + ' ng??y!'
      }
      else if (hasTaskPastDue == 0) {
        // task ?????n h???n ch??a k???t th??c
        percent = 100; outerStrokeColor = '#F7CA18'
      }
      else {
        // task ch??a ?????n h???n, ch??a k???t th??c
        let duration = endDate.diff(startDate, 'days', false);
        percent = Math.round(hasTaskPastDue * 100 / duration);
      }
    }

    return {
      isLate: isLate,
      lateBy: Math.abs(hasTaskPastDue),
      percent: percent,
      outerStrokeColor: outerStrokeColor,
      displayText: displayText
    }
  }
  /*
  
  filterList() {
    console.log(this.searchKey)
    switch (this.currentTab) {
      case 'assigned':
        if (this.originalAssignedTask != null) {
          let self = this;
          if (this.searchKey != '')
            this.currentAssignedTask = this.originalAssignedTask.filter(function (v, i) {
              if (self.removeAccents(v.chude.toLowerCase()).indexOf(self.removeAccents(self.searchKey)) >= 0
                || self.removeAccents(v.nguoiTaoHoTen.toLowerCase()).indexOf(self.removeAccents(self.searchKey)) >= 0) {
                return true;
              } else false;
            });
          else
            this.currentAssignedTask = Array.from(this.originalAssignedTask)
        }
        break;
      case 'forwarded':
        if (this.originalForwardedTask != null) {
          let self = this;
          if (this.searchKey != '')
            this.currentForwardedTask = this.originalForwardedTask.filter(function (v, i) {
              if (self.removeAccents(v.chude.toLowerCase()).indexOf(self.removeAccents(self.searchKey)) >= 0
                || self.removeAccents(v.nguoiTaoHoTen.toLowerCase()).indexOf(self.removeAccents(self.searchKey)) >= 0) {
                return true;
              } else false;
            });
          else
            this.currentForwardedTask = Array.from(this.originalForwardedTask)
        }
        break;
      case 'watchable':
        if (this.originalWatchableTask != null) {
          let self = this;
          if (this.searchKey != '')
            this.currentWatchableTask = this.originalWatchableTask.filter(function (v, i) {
              if (self.removeAccents(v.chude.toLowerCase()).indexOf(self.removeAccents(self.searchKey)) >= 0
                || self.removeAccents(v.nguoiTaoHoTen.toLowerCase()).indexOf(self.removeAccents(self.searchKey)) >= 0) {
                return true;
              } else false;
            });
          else
            this.currentWatchableTask = Array.from(this.originalWatchableTask)
        }
        break;
      default:
        break;
    }
  }
    changeTabs(tab) {
    this.searchKey = ''
    this.currentTab = tab;
    this.page = 0;
    this.count = 0;
    this.pageSize = 10;
    this.generateData();
  }
  async getTaskList() {
    this.spinnerLoading = true
    let options = {
      PageNumber: this.page,
      PageSize: this.pageSize,
      isPaging: true
    }
    try {
      let res
      let result
      let taskType
      switch (this.currentTab) {
        case 'assigned':
          taskType = '0'
          res = await this.api.httpCall(this.api.apiLists.getTasks + taskType, {}, options, 'get', true);
          result = <any>res
          this.originalAssignedTask = this.updateProgressInfoToList(result.data);
          this.currentAssignedTask = Array.from(this.originalAssignedTask)
          this.count = result.totalRecords
          this.paginationConfig = {
            id: 'paginationControl',
            itemsPerPage: this.pageSize,
            currentPage: this.page,
            totalItems: this.count
          }
          break;
        case 'forwarded':
          taskType = '1'
          res = await this.api.httpCall(this.api.apiLists.getTasks + taskType, {}, options, 'get', true);
          result = <any>res
          this.originalForwardedTask = this.updateProgressInfoToList(result.data);
          this.currentForwardedTask = Array.from(this.originalForwardedTask)
          this.count = result.totalRecords
          this.paginationConfig = {
            id: 'paginationControl',
            itemsPerPage: this.pageSize,
            currentPage: this.page,
            totalItems: this.count
          }
          break;
        case 'watchable':
          taskType = '2'
          res = await this.api.httpCall(this.api.apiLists.getTasks + taskType, {}, options, 'get', true);
          result = <any>res
          this.originalWatchableTask = this.updateProgressInfoToList(result.data);
          this.currentWatchableTask = Array.from(this.originalWatchableTask)
          this.count = result.totalRecords
          this.paginationConfig = {
            id: 'paginationControl',
            itemsPerPage: this.pageSize,
            currentPage: this.page,
            totalItems: this.count
          }
          break;
        default:
          break;
      }
      this.spinnerLoading = false
    } catch (error) {
      this.spinnerLoading = false
      this.myModal.toggle()
    }
  }
  */
}
