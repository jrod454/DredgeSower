import { Component } from '@angular/core';
import * as Papa from "node_modules/papaparse";
import {p} from "@angular/core/src/render3";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DredgeSower';
  raw_data_file: any;

  rows = [];

  ngOnInit() {
  }

  setFile = (event: any) => {
    this.raw_data_file = event.target.files[0];
    Papa.parse(this.raw_data_file, {
      complete: (data) => {
        console.log(data.data);
        data.data.forEach(person => {
          if (person[0] !== null) {
            this.rows.push([...person.slice(0,5), person[17]]);
          }
        });
        this.rows = [...this.rows];
        console.log(this.rows[6]);
      }
    });
  };

  sum = (total, number) => {
    return total + number;
  }
}
