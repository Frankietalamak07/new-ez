import { format } from 'date-fns';

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  start: Date;
  duration: number; // in minutes
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const start = event.start.toISOString().replace(/-|:|\.\d+/g, '');
  const end = new Date(event.start.getTime() + event.duration * 60000).toISOString().replace(/-|:|\.\d+/g, '');
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${start}/${end}`,
  });

  return `https://www.google.com/calendar/render?${params.toString()}`;
}
