// toast.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    private toastSubject = new Subject<ToastMessage>();
    toast$ = this.toastSubject.asObservable();

    showToast(title: string, message: string, type: 'success' | 'error' | 'info') {
        this.toastSubject.next({ title, message, type });
    }
}
