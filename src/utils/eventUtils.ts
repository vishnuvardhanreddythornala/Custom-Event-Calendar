import { v4 as uuidv4 } from 'uuid';
import { CalendarEvent, RecurrenceRule } from '../types';
import { doEventsConflict } from './dateUtils';

// Load events from localStorage
export const loadEvents = (): CalendarEvent[] => {
  try {
    const eventsJson = localStorage.getItem('calendar-events');
    if (!eventsJson) return [];
    
    const events = JSON.parse(eventsJson);
    
    // Convert string dates back to Date objects
    return events.map((event: any) => ({
      ...event,
      date: new Date(event.date),
      endTime: event.endTime ? new Date(event.endTime) : undefined,
      recurrence: {
        ...event.recurrence,
        endDate: event.recurrence.endDate ? new Date(event.recurrence.endDate) : null
      }
    }));
  } catch (error) {
    console.error('Error loading events from localStorage:', error);
    return [];
  }
};

// Save events to localStorage
export const saveEvents = (events: CalendarEvent[]): void => {
  try {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events to localStorage:', error);
  }
};

// Create a new event
export const createEvent = (
  title: string,
  date: Date,
  endTime?: Date,
  description?: string,
  color: string = 'blue',
  recurrence: RecurrenceRule = { type: 'none' }
): CalendarEvent => {
  return {
    id: uuidv4(),
    title,
    date,
    endTime,
    description,
    color: color as CalendarEvent['color'],
    recurrence,
  };
};

// Check for event conflicts
export const checkEventConflicts = (
  newEvent: CalendarEvent,
  existingEvents: CalendarEvent[]
): CalendarEvent[] => {
  return existingEvents.filter(
    (event) => event.id !== newEvent.id && doEventsConflict(newEvent, event)
  );
};

// Filter events by search term
export const filterEventsBySearchTerm = (
  events: CalendarEvent[],
  searchTerm: string
): CalendarEvent[] => {
  if (!searchTerm.trim()) return events;
  
  const term = searchTerm.toLowerCase();
  return events.filter(
    (event) => 
      event.title.toLowerCase().includes(term) ||
      (event.description && event.description.toLowerCase().includes(term))
  );
};

// Get color class based on event color
export const getEventColorClass = (color: CalendarEvent['color']): string => {
  const colorMap: Record<CalendarEvent['color'], string> = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    amber: 'bg-amber-500 hover:bg-amber-600',
    red: 'bg-red-500 hover:bg-red-600',
    pink: 'bg-pink-500 hover:bg-pink-600',
  };
  
  return colorMap[color] || colorMap.blue;
};

// Format recurrence rule as text
export const formatRecurrenceText = (recurrence: RecurrenceRule): string => {
  if (recurrence.type === 'none') return 'One-time event';
  
  const interval = recurrence.interval || 1;
  
  switch (recurrence.type) {
    case 'daily':
      return interval === 1 ? 'Daily' : `Every ${interval} days`;
    
    case 'weekly':
      if (recurrence.weekdays && recurrence.weekdays.length > 0) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const selectedDays = recurrence.weekdays.map(day => days[day]).join(', ');
        return interval === 1 
          ? `Weekly on ${selectedDays}` 
          : `Every ${interval} weeks on ${selectedDays}`;
      }
      return interval === 1 ? 'Weekly' : `Every ${interval} weeks`;
    
    case 'monthly':
      return interval === 1 ? 'Monthly' : `Every ${interval} months`;
    
    case 'custom':
      return `Every ${interval} days`;
    
    default:
      return 'Recurring event';
  }
};