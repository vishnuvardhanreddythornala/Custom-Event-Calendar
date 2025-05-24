import React, { useState, useEffect } from 'react';
import { format, parse, addHours } from 'date-fns';
import { CalendarEvent, EventColor, RecurrenceType, RecurrenceRule } from '../../types';
import { createEvent, checkEventConflicts } from '../../utils/eventUtils';

interface EventFormProps {
  event: CalendarEvent | null;
  date: Date | null;
  existingEvents: CalendarEvent[];
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  date,
  existingEvents,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState<EventColor>('blue');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none');
  const [interval, setInterval] = useState(1);
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [endDate, setEndDate] = useState('');
  const [conflictingEvents, setConflictingEvents] = useState<CalendarEvent[]>([]);
  const [showConflicts, setShowConflicts] = useState(false);

  // Set initial form values from props
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setEventDate(format(event.date, 'yyyy-MM-dd'));
      setStartTime(format(event.date, 'HH:mm'));
      setEndTime(event.endTime ? format(event.endTime, 'HH:mm') : '');
      setColor(event.color);
      setRecurrenceType(event.recurrence.type);
      setInterval(event.recurrence.interval || 1);
      setWeekdays(event.recurrence.weekdays || []);
      setEndDate(event.recurrence.endDate ? format(event.recurrence.endDate, 'yyyy-MM-dd') : '');
    } else if (date) {
      setEventDate(format(date, 'yyyy-MM-dd'));
      setStartTime(format(new Date(), 'HH:mm'));
      setEndTime(format(addHours(new Date(), 1), 'HH:mm'));
    }
  }, [event, date]);

  // Handle weekday selection for weekly recurrence
  const handleWeekdayToggle = (day: number) => {
    setWeekdays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  // Check for conflicts when form values change
  useEffect(() => {
    if (!title || !eventDate || !startTime) return;

    try {
      const dateObj = parse(eventDate, 'yyyy-MM-dd', new Date());
      const startObj = parse(startTime, 'HH:mm', dateObj);
      const endObj = endTime ? parse(endTime, 'HH:mm', dateObj) : undefined;
      
      // Create a temporary event to check conflicts
      const tempEvent: CalendarEvent = {
        id: event?.id || 'temp-id',
        title,
        date: startObj,
        endTime: endObj,
        description,
        color,
        recurrence: {
          type: recurrenceType,
          interval,
          weekdays: recurrenceType === 'weekly' ? weekdays : undefined,
          endDate: endDate ? parse(endDate, 'yyyy-MM-dd', new Date()) : null,
        },
      };

      const conflicts = checkEventConflicts(tempEvent, existingEvents);
      setConflictingEvents(conflicts);
    } catch (error) {
      console.error('Error checking conflicts:', error);
    }
  }, [title, eventDate, startTime, endTime, recurrenceType, interval, weekdays, endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !eventDate || !startTime) return;
    
    try {
      const dateObj = parse(eventDate, 'yyyy-MM-dd', new Date());
      const startObj = parse(startTime, 'HH:mm', dateObj);
      const endObj = endTime ? parse(endTime, 'HH:mm', dateObj) : undefined;
      
      // Create recurrence rule
      const recurrence: RecurrenceRule = {
        type: recurrenceType,
        interval,
        weekdays: recurrenceType === 'weekly' ? weekdays : undefined,
        endDate: endDate ? parse(endDate, 'yyyy-MM-dd', new Date()) : null,
      };
      
      if (conflictingEvents.length > 0) {
        // Show conflicts and allow user to confirm or cancel
        setShowConflicts(true);
        return;
      }
      
      // Create or update event
      const savedEvent = event
        ? {
            ...event,
            title,
            date: startObj,
            endTime: endObj,
            description,
            color,
            recurrence,
          }
        : createEvent(title, startObj, endObj, description, color, recurrence);
      
      onSave(savedEvent);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
    }
  };

  const colorOptions: { value: EventColor; label: string }[] = [
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
    { value: 'amber', label: 'Amber' },
    { value: 'red', label: 'Red' },
    { value: 'pink', label: 'Pink' },
  ];

  const recurrenceOptions: { value: RecurrenceType; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom' },
  ];

  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Event title"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value as EventColor)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {colorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Event description"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recurrence
        </label>
        <select
          value={recurrenceType}
          onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {recurrenceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {recurrenceType !== 'none' && (
        <div className="space-y-4 border-t border-gray-200 pt-4">
          {/* Interval setting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repeat every
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span>
                  {recurrenceType === 'daily' ? 'days' : 
                   recurrenceType === 'weekly' ? 'weeks' : 
                   recurrenceType === 'monthly' ? 'months' : 'days'}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End date (optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Weekday selection for weekly recurrence */}
          {recurrenceType === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat on
              </label>
              <div className="flex flex-wrap gap-2">
                {weekdayLabels.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleWeekdayToggle(index)}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                      ${weekdays.includes(index)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {day.substring(0, 1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {showConflicts && conflictingEvents.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-md">
          <p className="text-yellow-800 font-medium mb-2">
            Warning: This event conflicts with {conflictingEvents.length} existing event(s):
          </p>
          <ul className="list-disc pl-5 text-sm text-yellow-700 mb-3">
            {conflictingEvents.slice(0, 3).map((e) => (
              <li key={e.id}>
                {e.title} ({format(e.date, 'MMM d, yyyy h:mm a')})
              </li>
            ))}
            {conflictingEvents.length > 3 && (
              <li>...and {conflictingEvents.length - 3} more</li>
            )}
          </ul>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowConflicts(false)}
              className="px-3 py-1 text-sm bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setShowConflicts(false);
                
                // Force save despite conflicts
                const dateObj = parse(eventDate, 'yyyy-MM-dd', new Date());
                const startObj = parse(startTime, 'HH:mm', dateObj);
                const endObj = endTime ? parse(endTime, 'HH:mm', dateObj) : undefined;
                
                const recurrence: RecurrenceRule = {
                  type: recurrenceType,
                  interval,
                  weekdays: recurrenceType === 'weekly' ? weekdays : undefined,
                  endDate: endDate ? parse(endDate, 'yyyy-MM-dd', new Date()) : null,
                };
                
                const savedEvent = event
                  ? {
                      ...event,
                      title,
                      date: startObj,
                      endTime: endObj,
                      description,
                      color,
                      recurrence,
                    }
                  : createEvent(title, startObj, endObj, description, color, recurrence);
                
                onSave(savedEvent);
              }}
              className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Save Anyway
            </button>
          </div>
        </div>
      )}
      
      <div className="flex justify-between pt-4 border-t border-gray-200">
        {event && onDelete ? (
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        ) : (
          <div></div>
        )}
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EventForm;