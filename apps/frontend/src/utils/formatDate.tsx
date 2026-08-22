export function formatDate(
  dateString: string | Date | null | undefined,
): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  // Format day with ordinal suffix
  const day = date.getDate();
  const ordinalSuffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th';

  const formattedDay = `${day}${ordinalSuffix}`;

  // Format month reliably without depending on browser locales
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = months[date.getMonth()];

  // Format year
  const year = date.getFullYear();

  // Format time
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedTime = `${((hours + 11) % 12) + 1}:${minutes} ${period}`;

  // Combine all parts
  return `${formattedDay} ${month} ${year}, ${formattedTime}`;
}
