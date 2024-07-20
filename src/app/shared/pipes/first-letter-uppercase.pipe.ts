import { Pipe, PipeTransform, NgModule } from '@angular/core';

@Pipe({
  name: 'firstLetterUppercase'
})
export class FirstLetterUppercasePipe implements PipeTransform {

  transform(word: string): string {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

}

@NgModule({
  declarations: [FirstLetterUppercasePipe],
  exports: [FirstLetterUppercasePipe]
})

export class FirstLetterUppercasePipeModule { }
