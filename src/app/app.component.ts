import { Component } from '@angular/core';
import * as Papa from "node_modules/papaparse";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DredgeSower';
  raw_data_file: any;
  raw_rows = [];
  distinctClass = [];
  distinctWeight = [];
  distinctBelt = [];

  selectedClass = "";
  selectedWeight = "";
  selectedBelt = "";

  rows = [];

  ngOnInit() {
  }

  setFile = (event: any) => {
    this.raw_data_file = event.target.files[0];
    Papa.parse(this.raw_data_file, {
      complete: (data) => {
        console.log(data.data);
        this.raw_rows = [...data.data.slice(5, data.data.length - 1)];
        this.distinctClass = [...new Set(this.raw_rows.map(row => row[0].trim().toLowerCase()))];
        this.distinctWeight = [...new Set(this.raw_rows.map(row => row[1].trim().toLowerCase()))];
        this.distinctBelt = [...new Set(this.raw_rows.map(row => row[2].trim().toLowerCase()))];
        this.rows = this.raw_rows;
      }
    });
  };

  updateTable = () => {
    this.rows = this.raw_rows.filter(row => {
      let currentClass = row[0].trim().toLowerCase();
      let currentWeight = row[1].trim().toLowerCase();
      let currentBelt = row[2].trim().toLowerCase();
      return currentClass === this.selectedClass &&
        currentWeight === this.selectedWeight &&
        currentBelt === this.selectedBelt
    });
    this.rows.sort(((a, b) => b[17] - a[17]));
  };

  updateClass = () => {

  };

  sum = (total, number) => {
    return total + number;
  }
}
