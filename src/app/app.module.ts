import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DatabaseService } from './database.service';
import { ForceDirectedGraphExampleComponent } from './force-directed-graph-example/force-directed-graph-example.component';
import {StylingService} from "./styling.service";

@NgModule({
  declarations: [
    AppComponent,
    ForceDirectedGraphExampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    DatabaseService,
    StylingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
