import { Pipe, PipeTransform, NgModule } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Pipe({
  name: 'safeHtml',
})

export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

@NgModule({
  declarations: [SafeHtmlPipe],
  exports: [SafeHtmlPipe]
})

export class SafeHtmlPipeModule { }


