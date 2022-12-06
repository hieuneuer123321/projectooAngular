import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UtilitiesModule } from './utilities/utilities.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PersonalComponent } from './personal/personal.component';
import { ClientComponent } from './client/client/client.component';
import { NgChartsModule } from 'ng2-charts';
import { SignDocumentsComponent } from './sign-documents/sign-documents.component';
import { SearchComponent } from './search/search/search.component';
import { AdminComponent } from './admin/admin/admin.component';




@NgModule({

  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    PersonalComponent,  
    ClientComponent,
    SignDocumentsComponent,
    SearchComponent,
    AdminComponent,
  
  ],
  imports: [
    BrowserAnimationsModule,
    NgChartsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    UtilitiesModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      tapToDismiss: true
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
