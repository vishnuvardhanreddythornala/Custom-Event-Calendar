import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import SearchBar from '../UI/SearchBar';
import { getNextMonth, getPrevMonth, getDaysWithEvents } from '../../utils/dateUtils';
import { loadEvents, saveEvents, filterEventsBySearchTerm } from '../../utils/eventUtils';
import { CalendarEvent, DayWithEvents } from '../../types';
import EventModal from '../Events/EventModal';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [days, setDays] = useState<DayWithEvents[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents: CalendarEvent[] = loadEvents();
    setEvents(savedEvents);
    setFilteredEvents(savedEvents);
  }, []);

  // Update days whenever the current month or events change
  useEffect(() => {
    setDays(getDaysWithEvents(currentDate, filteredEvents));
  }, [currentDate, filteredEvents]);

  // Handle filtering events when search term changes
  useEffect(() => {
    setFilteredEvents(filterEventsBySearchTerm(events, searchTerm));
  }, [events, searchTerm]);

  // Navigation handlers
  const handlePrevMonth = (): void => {
    setCurrentDate(getPrevMonth(currentDate));
  };

  const handleNextMonth = (): void => {
    setCurrentDate(getNextMonth(currentDate));
  };

  // Event handlers
  const handleAddEvent = (): void => {
    setSelectedEvent(null);
    setSelectedDate(new Date());
    setIsModalOpen(true);
  };

  const handleDayClick = (date: Date): void => {
    setSelectedEvent(null);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent): void => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: CalendarEvent): void => {
    const updatedEvents = selectedEvent
      ? events.map((e) => (e.id === event.id ? event : e))
      : [...events, event];

    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (eventId: string): void => {
    const updatedEvents = events.filter((e) => e.id !== eventId);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setIsModalOpen(false);
  };

  const handleEventDrop = (event: CalendarEvent, date: Date): void => {
    const originalDateStart = new Date(event.date).setHours(0, 0, 0, 0);
    const newDateStart = date.setHours(0, 0, 0, 0);
    const timeDiff = newDateStart - originalDateStart;

    const updatedEvent: CalendarEvent = {
      ...event,
      date: new Date(event.date.getTime() + timeDiff),
      endTime: event.endTime
        ? new Date(event.endTime.getTime() + timeDiff)
        : undefined
    };

    const updatedEvents = events.map((e) =>
      e.id === event.id ? updatedEvent : e
    );

    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  };

  const handleSearchChange = (term: string): void => {
    setSearchTerm(term);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onAddEvent={handleAddEvent}
      />

      <SearchBar
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4"
      />

      <CalendarGrid
        days={days}
        onDayClick={handleDayClick}
        onEventClick={handleEventClick}
        onEventDrop={handleEventDrop}
      />

      {isModalOpen && (
        <EventModal
          event={selectedEvent}
          date={selectedDate}
          existingEvents={events}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Calendar;
