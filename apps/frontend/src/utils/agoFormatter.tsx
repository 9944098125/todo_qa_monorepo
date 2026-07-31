export const formatRelativeDate = (dateString: string): string => {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const timeDiff = currentDate.getTime() - inputDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) return 'Invalid date'; // Future dates handling
  if (daysDiff === 0) return 'Today';
  if (daysDiff === 1) return 'Yesterday';
  return `${daysDiff} days ago`;
};
