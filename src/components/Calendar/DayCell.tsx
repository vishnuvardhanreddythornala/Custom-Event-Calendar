import React from 'react';
import { formatDate, isSameDayFn } from '../../utils/dateUtils';
import { CalendarEvent } from '../../types';
import { getEventColorClass } from '../../utils/eventUtils';

interface DayCellProps {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onDragStart: (event: CalendarEvent, date: Date) => void;
  onDragOver: (e: React.DragOverEvent, date: Date) => void;
  onDrop: (e: React.DragEvent, date: Date) => void;
}

const DayCell: React.FC<DayCellProps> = ({
  date,
  events,
  isCurrentMonth,
  isToday,
  onClick,
  onEventClick,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  // Sort events by time
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Limit displayed events to prevent overflow
  const displayLimit = 3;
  const displayedEvents = sortedEvents.slice(0, displayLimit);
  const hiddenEventsCount = sortedEvents.length - displayLimit;

  return (
    <div 
      className={`
        min-h-24 border border-gray-200 p-1
        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
        ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}
      `}
      onClick={() => onClick(date)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e, date);
      }}
      onDrop={(e) => onDrop(e, date)}
    >
      <div className="flex justify-between">
        <span 
          className={`
            text-sm font-medium p-1 w-7 h-7 flex items-center justify-center rounded-full
            ${isToday ? 'bg-blue-500 text-white' : 'text-gray-700'}
          `}
        >
          {formatDate(date, 'd')}
        </span>
        <span className="text-xs text-gray-500">
          {formatDate(date, 'EEE')}
        </span>
      </div>
      
      <div className="mt-1 space-y-1 max-h-[calc(100%-2rem)] overflow-hidden">
        {displayedEvents.map((event) => (
          <div
            key={`${event.id}-${formatDate(date, 'yyyy-MM-dd')}`}
            className={`
              text-xs p-1 rounded truncate cursor-pointer
              ${getEventColorClass(event.color)} text-white
            `}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              onDragStart(event, date);
            }}
          >
            {event.title}
          </div>
        ))}
        
        {hiddenEventsCount > 0 && (
          <div className="text-xs text-gray-500 px-1">
            + {hiddenEventsCount} more
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCell;