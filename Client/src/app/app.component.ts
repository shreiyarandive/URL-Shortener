import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ShortUrl } from './ShortUrl.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Front-End';

  urlForm!: FormGroup;
  dataSource!: ShortUrl[];
  displayedColumns: string[] = ['full', 'short', 'clicks'];

  url: string = 'http://localhost:5000';
  constructor(private formBuilder: FormBuilder, private http: HttpClient, @Inject(DOCUMENT) private document: Document) {
    this.urlForm = this.formBuilder.group({
      url: [null, [Validators.required]]
    })
  }
  ngOnInit(): void {
    this.getData();
  }
  getData() {
    this.http.get<any>(environment.hostUrl + '/getUrls')
      .subscribe(result => {
        this.dataSource = result;
      }, (err: any) => {
        console.log(err);
      })
  }
  shortenUrl() {
    this.http.post(`${environment.hostUrl}/shortUrls`, this.urlForm.value)
      .subscribe((result: any) => {
        this.getData();
      }, (err: any) => {
        console.log('err', err);
      });
  }
}
