import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.router.onSameUrlNavigation = 'reload';
    console.log('AppVersion:', environment.version);
  }
}
