import React from 'react';
import { X } from 'lucide-react';
import EventForm from './EventForm';
import { CalendarEvent } from '../../types';

interface EventModalProps {
  event: CalendarEvent | null;
  date: Date | null;
  existingEvents: CalendarEvent[];
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  event,
  date,
  existingEvents,
  onSave,
  onDelete,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-auto p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {event ? 'Edit Event' : 'Add Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <EventForm
          event={event}
          date={date}
          existingEvents={existingEvents.filter(e => e.id !== event?.id)}
          onSave={onSave}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default EventModal;