export type EventColor = 'blue' | 'green' | 'purple' | 'amber' | 'red' | 'pink';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface RecurrenceRule {
  type: RecurrenceType;
  interval?: number;
  weekdays?: number[];
  endDate?: Date | null;
  occurrences?: number | null;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  endTime?: Date;
  description?: string;
  color: EventColor;
  recurrence: RecurrenceRule;
}

export interface DayWithEvents {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

// Add DragEvent type to fix TypeScript errors
declare global {
  namespace React {
    interface DragEvent<T = Element> extends MouseEvent<T> {
      dataTransfer: DataTransfer;
    }
    interface DragOverEvent<T = Element> extends MouseEvent<T> {
      dataTransfer: DataTransfer;
    }
  }
}