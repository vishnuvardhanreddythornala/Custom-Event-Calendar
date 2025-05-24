import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  addDays,
  addWeeks,
  addMonths as addMonthsFn,
  isWithinInterval,
  isAfter,
  isBefore,
} from 'date-fns';
import { CalendarEvent, DayWithEvents, RecurrenceRule } from '../types';

// Get all days to display in the calendar (including days from prev/next month to fill the grid)
export const getCalendarDays = (date: Date): Date[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

// Format dates for display
export const formatDate = (date: Date, formatStr: string): string => {
  return format(date, formatStr);
};

// Check if two dates are the same day
export const isSameDayFn = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

// Get days with events for the current month view
export const getDaysWithEvents = (
  currentDate: Date,
  events: CalendarEvent[]
): DayWithEvents[] => {
  const days = getCalendarDays(currentDate);
  
  return days.map((day) => {
    // Include both single events and expanded recurring events
    const dayEvents = getEventsForDay(day, events);
    
    return {
      date: day,
      isCurrentMonth: isSameMonth(day, currentDate),
      isToday: isToday(day),
      events: dayEvents,
    };
  });
};

// Navigation helpers
export const getNextMonth = (date: Date): Date => addMonths(date, 1);
export const getPrevMonth = (date: Date): Date => subMonths(date, 1);

// Handle recurring events
export const getEventsForDay = (
  day: Date,
  events: CalendarEvent[]
): CalendarEvent[] => {
  return events.filter((event) => {
    // Check for regular events (non-recurring)
    if (event.recurrence.type === 'none' && isSameDay(day, event.date)) {
      return true;
    }

    // Check for recurring events
    if (event.recurrence.type !== 'none') {
      return doesRecurringEventOccurOnDay(event, day);
    }

    return false;
  });
};

// Determine if a recurring event occurs on a specific day
export const doesRecurringEventOccurOnDay = (
  event: CalendarEvent,
  day: Date
): boolean => {
  const { recurrence } = event;
  const eventStart = new Date(event.date);
  
  // Event must start on or before the day we're checking
  if (isBefore(day, eventStart)) {
    return false;
  }
  
  // Check if past end date
  if (recurrence.endDate && isAfter(day, recurrence.endDate)) {
    return false;
  }
  
  // Daily recurrence
  if (recurrence.type === 'daily') {
    const interval = recurrence.interval || 1;
    const daysDiff = Math.floor((day.getTime() - eventStart.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff % interval === 0;
  }
  
  // Weekly recurrence
  if (recurrence.type === 'weekly') {
    const interval = recurrence.interval || 1;
    const weeksDiff = Math.floor((day.getTime() - eventStart.getTime()) / (1000 * 60 * 60 * 24 * 7));
    
    // Check if it's the right week based on interval
    if (weeksDiff % interval !== 0) {
      return false;
    }
    
    // Check if it's the right day of week
    if (recurrence.weekdays && recurrence.weekdays.length > 0) {
      return recurrence.weekdays.includes(day.getDay());
    } else {
      // If no specific weekdays, check if same day of week as original event
      return day.getDay() === eventStart.getDay();
    }
  }
  
  // Monthly recurrence
  if (recurrence.type === 'monthly') {
    const interval = recurrence.interval || 1;
    const monthsDiff = 
      (day.getFullYear() - eventStart.getFullYear()) * 12 + 
      day.getMonth() - eventStart.getMonth();
    
    if (monthsDiff % interval !== 0) {
      return false;
    }
    
    return day.getDate() === eventStart.getDate();
  }
  
  // Custom recurrence (example: every X days)
  if (recurrence.type === 'custom' && recurrence.interval) {
    const daysDiff = Math.floor((day.getTime() - eventStart.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff % recurrence.interval === 0;
  }
  
  return false;
};

// Check if two events conflict in time
export const doEventsConflict = (event1: CalendarEvent, event2: CalendarEvent): boolean => {
  // If events are on different days, they don't conflict
  if (!isSameDay(event1.date, event2.date)) {
    return false;
  }
  
  // If either event doesn't have an end time, we consider them as all-day
  // All-day events conflict with any event on the same day
  if (!event1.endTime || !event2.endTime) {
    return true;
  }
  
  // Check for time overlap
  return (
    (isWithinInterval(event1.date, { start: event2.date, end: event2.endTime }) ||
     isWithinInterval(event1.endTime, { start: event2.date, end: event2.endTime }) ||
     isWithinInterval(event2.date, { start: event1.date, end: event1.endTime }) ||
     isWithinInterval(event2.endTime, { start: event1.date, end: event1.endTime }))
  );
};