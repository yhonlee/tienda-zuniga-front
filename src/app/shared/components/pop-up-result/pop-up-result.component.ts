import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up-result',
  templateUrl: './pop-up-result.component.html',
  styleUrls: ['./pop-up-result.component.scss']
})
export class PopUpResultComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public message: string) { }

  ngOnInit() {
  }
}
