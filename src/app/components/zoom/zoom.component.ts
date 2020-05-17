import { Component, OnInit } from '@angular/core';

const FONT_SIZE_KEY = 'default-font-size';

/**
 * Enables zooming in the game for better user experience
 */
@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.css']
})
export class ZoomComponent implements OnInit {

  fontSize = 16;
  dF = 0;
  message = '';
  constructor() { }

  ngOnInit() {
    this.load();
    this.applyZoom();
  }

  load() {
    const value = localStorage.getItem(FONT_SIZE_KEY);
    if (value) {
      this.fontSize = parseInt(value);
      this.dF = this.fontSize - 16;
    }
  }

  applyZoom() {
    document.querySelector('html').style.fontSize = `${this.fontSize}px`;
  }

  zoomIn() {
    this.fontSize++;
    this.dF++;
    this.applyZoom();
    this.displayMessage(this.dF.toString());
    this.save();
  }

  zoomOut() {
    this.fontSize--;
    this.dF--;
    this.applyZoom();
    this.displayMessage(this.dF.toString());
    this.save();
  }

  save() {
    localStorage.setItem(FONT_SIZE_KEY, this.fontSize.toString());
  }

  displayMessage(msg: string) {
    this.message = msg;
    setTimeout(() => {
      if (this.message === msg) this.message = '';
    }, 1000);
  }

}
