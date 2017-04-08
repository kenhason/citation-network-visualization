import { Injectable } from '@angular/core';

@Injectable()
export class StylingService {

  public setCanvasWindowSize(context) {
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
  }

  public turnOnAutoResizeCanvas(context) {
    window.addEventListener("resize",() => {
      context.canvas.width  = window.innerWidth;
      context.canvas.height = window.innerHeight;
    });
  }

}
