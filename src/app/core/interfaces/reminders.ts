export interface Reminder {
    reminders_id: number
    vehicle: string
    due_date: string
    task: string
}

export interface NewReminder {
    vehicle: string
    due_date: string
    task: string
}