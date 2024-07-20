import { Pipe, PipeTransform, NgModule } from '@angular/core';

import { memoize } from 'lodash';

import { ButtonClassState } from '../enums/state-button.enum';
import { Estado } from '../enums/estado.enum';

@Pipe({
  name: 'stateClassButton',
  pure: true
})

export class StateClassButtonPipe implements PipeTransform {

  transform(state: string): string {
    return addClassStateMemoize(state);
  }

}

const stateToClassMapper: { [key: string]: ButtonClassState } = {
  [Estado.ACTIVE]: ButtonClassState.ACTIVE,
  [Estado.INACTIVE]: ButtonClassState.INACTIVE,
}

const addClassState = (state: string): string => {
  return stateToClassMapper[state];
}

const addClassStateMemoize = memoize(addClassState);

@NgModule({
  declarations: [StateClassButtonPipe],
  exports: [StateClassButtonPipe]
})

export class StateClassButtonPipeModule { }
