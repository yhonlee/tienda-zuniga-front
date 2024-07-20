import { Pipe, PipeTransform, NgModule } from '@angular/core';

@Pipe({
  name: 'highlight'
})

export class HighlightPipe implements PipeTransform {

  transform(text: string, search: string, ctrlValue: string): string {
    const pattern = search
      .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
      .split(' ')
      .filter(t => t.length > 0)
      .join('|');
    const regex = new RegExp(pattern, 'gi');
    return (search && ctrlValue) ? text.replace(regex, match => `<b>${match}</b>`) : text;
  }

}

@NgModule({
  declarations: [HighlightPipe],
  exports: [HighlightPipe]
})

export class HighlightPipeModule { }