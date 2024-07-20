import { inject, DestroyRef } from '@angular/core';
import { Subject, takeUntil, MonoTypeOperatorFunction } from 'rxjs';

export function untilDestroyed(): <T>() => MonoTypeOperatorFunction<T> {

    const subject = new Subject();

    inject(DestroyRef).onDestroy(() => {
        subject.next(true);
        subject.complete();
    });

    return <T>() => takeUntil<T>(subject.asObservable());

}