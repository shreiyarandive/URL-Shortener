import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

    this.getData();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

   

  }

  getData() {
    this.http.get<any>(this.url + '/getUrls')
      .subscribe(result => {
        this.dataSource = result;
       }, (err: any) => {
        console.log(err);
      })
  }
  shortenUrl() {

    console.log(this.urlForm.value.url);
    this.http.post('http://localhost:5000/shortUrls', this.urlForm.value)
      .subscribe((result: any) => {
        this.getData();
      }, (err: any) => {
      })

      
  }
  
  // redirect to the original link if clicked on the full URL 
  redirectOriginalUrl(link: string) {
    this.document.location.href = link;
  }

  // get the full url from the database using the short url and then
  // redirect to the full url
  redirectShortUrl(link: string) {
    this.http.get(this.url + '/' + link)
      .subscribe((result: any) => {
        this.document.location.href = result.fullUrl;
      })
  }
}
