import React from 'react';
import DayCell from './DayCell';
import { DayWithEvents, CalendarEvent } from '../../types';

interface CalendarGridProps {
  days: DayWithEvents[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventDrop: (event: CalendarEvent, date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  onDayClick,
  onEventClick,
  onEventDrop,
}) => {
  const [draggedEvent, setDraggedEvent] = React.useState<CalendarEvent | null>(null);
  const [dragSourceDate, setDragSourceDate] = React.useState<Date | null>(null);

  const handleDragStart = (event: CalendarEvent, date: Date) => {
    setDraggedEvent(event);
    setDragSourceDate(date);
  };

  const handleDragOver = (e: React.DragOverEvent, date: Date) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    
    if (draggedEvent) {
      onEventDrop(draggedEvent, date);
      setDraggedEvent(null);
      setDragSourceDate(null);
    }
  };

  // Weekday headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div 
            key={day} 
            className="py-2 text-center text-sm font-semibold text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 grid-rows-6 h-[calc(100vh-12rem)]">
        {days.map((day) => (
          <DayCell
            key={day.date.toISOString()}
            date={day.date}
            events={day.events}
            isCurrentMonth={day.isCurrentMonth}
            isToday={day.isToday}
            onClick={onDayClick}
            onEventClick={onEventClick}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;