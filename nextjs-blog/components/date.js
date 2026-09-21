// Date display helper — turns an ISO date string into readable text
import { parseISO, format } from 'date-fns'; // parseISO: string → Date; format: Date → display text

// dateString example: '2026-09-14'
export default function Date({ dateString }) {
  // Convert the ISO string into a real Date object
  const date = parseISO(dateString);
  // <time> is semantic HTML; dateTime keeps a machine-readable value
  // 'LLLL d, yyyy' → e.g. September 14, 2026
  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
}
