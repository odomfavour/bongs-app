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

export const calculateCountdown = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);

  // Check if the endDate is valid
  if (isNaN(end.getTime())) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const diff = end.getTime() - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days: days || 0,
    hours: hours || 0,
    minutes: minutes || 0,
    seconds: seconds || 0,
  };
};
