export function formatDate(dateString) {
  const date = new Date(dateString);

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

  // Format month
  const month = date.toLocaleString('default', { month: 'long' });

  // Format year
  const year = date.getFullYear();

  // Format time
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedTime = `${((hours + 11) % 12) + 1}:${minutes}${period}`;

  // Combine all parts
  return `${formattedDay} ${month} ${year}, ${formattedTime}`;
}
