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

export const getSubscriberIdFromUrl = () => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (currentUrl.includes('werl')) {
    return 1;
  } else if (currentUrl.includes('subscriber1')) {
    return 2;
  } else if (currentUrl.includes('subscriber2')) {
    return 3;
  } else {
    return null;
  }
};
