import {Component, HostListener} from '@angular/core';
import * as Papa from "node_modules/papaparse";
import {HttpClient} from "@angular/common/http";
import * as JSZip from 'jszip';
import * as Docxtemplater from 'docxtemplater';
import * as JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';
import DocxMerger from 'docx-merger';

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

  progress: number = 0;

  iframeSrc: any = null;

  rows = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    JSZipUtils.getBinaryContent('assets/testing.docx', (err, content) => {
      if (err) {
        alert(err);
      } else {

        let out1 = AppComponent.generateAndGetBlob(content, {stuff: 'John'});
        let out2 = AppComponent.generateAndGetBlob(content, {stuff: 'John2'});
        let out3 = AppComponent.generateAndGetBlob(content, {stuff: 'John3'});
        let out4 = AppComponent.generateAndGetBlob(content, {stuff: 'John4'});
        let out5 = AppComponent.generateAndGetBlob(content, {stuff: 'John5'});
        let out6 = AppComponent.generateAndGetBlob(content, {stuff: 'John6'});

        this.mergeAndSaveDocs(out1, out2, out3, out4, out5, out6);
      }
    });
  }

  static generateAndGetBlob = (content, data) => {
    let zip = new JSZip(content);
    let doc = new Docxtemplater();
    doc.loadZip(zip);
    doc.setData(data);
    doc.render();
    let results = doc.getZip().generate({type: "blob"});
    return results;
  };

  mergeAndSaveDocs = (...docBlobs) => {
    let allPromises = docBlobs.map(blob => {
      return fetch(URL.createObjectURL(blob));
    });
    Promise.all(allPromises).then(temps => {
      let morePromises = temps.map(temp => {return temp.arrayBuffer()});
      Promise.all(morePromises).then(bins => {
        console.log('123');
        let docx = new DocxMerger({}, bins);
        console.log('2');
        docx.save('blob', function (data) {
          // FileSaver.saveAs(data, "output.docx");
        });
      });
    });

  };

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    console.log(event);
    this.shutdown();
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

  shutdown = () => {
    this.http.post("http://localhost:8080/actuator/shutdown", null).subscribe(data => {
      console.log(data);
    });
    console.log("Shutdown sent.");
  };

  updateClass = () => {

  };

  sum = (total, number) => {
    return total + number;
  }
}
