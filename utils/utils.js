export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const dateOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString('en-US', dateOptions);
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

  return `${formattedDate} | ${formattedTime}`;
};
