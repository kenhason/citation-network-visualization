import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GraphDisplayComponent } from './graph-display/graph-display.component';
import { DatabaseService } from './database.service';
import { ForceDirectedGraphExampleComponent } from './force-directed-graph-example/force-directed-graph-example.component';

@NgModule({
  declarations: [
    AppComponent,
    GraphDisplayComponent,
    ForceDirectedGraphExampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    DatabaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
