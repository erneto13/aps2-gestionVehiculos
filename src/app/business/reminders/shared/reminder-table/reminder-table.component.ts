import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

// Core
import { Reminder } from '../../../../core/interfaces/reminders';

// PrimeNG
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-reminder-table',
  standalone: true,
  imports: [DatePipe, CommonModule, TitleCasePipe, DialogModule],
  templateUrl: './reminder-table.component.html',
})
export class ReminderTableComponent implements OnInit, OnChanges {
  @Input() reminders: Reminder[] = [];
  @Input() isLoading: boolean = false;
  @Output() delete = new EventEmitter<number>();

  currentDate: Date = new Date();
  monthName: string = this.currentDate.toLocaleString('default', { month: 'long' });
  year: number = this.currentDate.getFullYear();
  currentDay: number = this.currentDate.getDate();
  currentDayOfWeek: string = this.currentDate.toLocaleString('default', { weekday: 'long' });
  currentWeek: number = this.getWeekNumber(this.currentDate);

  calendarDays: any[] = [];
  visible: boolean = false;
  selectedReminder: Reminder | null = null;

  monthIndex: number = this.currentDate.getMonth();

  ngOnInit() {
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reminders']) {
      this.generateCalendar();
    }
  }

  generateCalendar() {
    const firstDayOfMonth = new Date(this.year, this.monthIndex, 1);
    const daysInMonth = new Date(this.year, this.monthIndex + 1, 0).getDate();
  
    this.calendarDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.year, this.monthIndex, i);
      const formattedDate = date.toISOString().split('T')[0]; 
  
      const remindersForDay = this.reminders.filter(reminder =>
        reminder.due_date.split(' ')[0] === formattedDate
      );
  
      const isToday = formattedDate === this.currentDate.toISOString().split('T')[0]; 
  
      this.calendarDays.push({
        day: i,
        date: formattedDate,
        reminders: remindersForDay,
        isToday: isToday
      });
    }
  }

  deleteReminder(id: number): void {
    this.visible = false;
    this.delete.emit(id);
  }

  getWeekNumber(date: Date): number {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - startDate.getTime();
    const oneDay = 1000 * 3600 * 24;
    const weekNumber = Math.ceil((diff / oneDay + 1) / 7);
    return weekNumber;
  }

  onReminderClick(reminder: Reminder): void {
    this.selectedReminder = reminder;
    this.visible = true;
  }

  previousMonth() {
    this.monthIndex--;
    if (this.monthIndex < 0) {
      this.monthIndex = 11;
      this.year--;
    }
    this.updateMonthYear();
    this.generateCalendar();
  }

  nextMonth() {
    this.monthIndex++;
    if (this.monthIndex > 11) {
      this.monthIndex = 0;
      this.year++;
    }
    this.updateMonthYear();
    this.generateCalendar();
  }

  updateMonthYear() {
    const date = new Date(this.year, this.monthIndex, 1);
    this.monthName = date.toLocaleString('default', { month: 'long' });
  }
}
