import { Component, Input, OnInit } from '@angular/core';
import { IBreadcrumb } from './breadcrumb.interface';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input()
  items: IBreadcrumb[] = [];

  ngOnInit(): void {
  }

}
