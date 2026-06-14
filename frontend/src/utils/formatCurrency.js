export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return formatDate(date);
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
};

export const generateBatchId = () => {
  const prefix = 'PC';
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${year}-${random}`;
};

export const calculatePurityScore = (metrics) => {
  const weights = { lauricAcid: 0.3, moisture: 0.25, ffa: 0.25, peroxide: 0.2 };
  let score = 0;
  if (metrics.lauricAcid >= 45) score += weights.lauricAcid * 100;
  else score += (metrics.lauricAcid / 45) * weights.lauricAcid * 100;
  if (metrics.moisture <= 0.1) score += weights.moisture * 100;
  else score += ((0.5 - metrics.moisture) / 0.4) * weights.moisture * 100;
  if (metrics.ffa <= 0.1) score += weights.ffa * 100;
  else score += ((0.5 - metrics.ffa) / 0.4) * weights.ffa * 100;
  if (metrics.peroxide <= 1) score += weights.peroxide * 100;
  else score += ((3 - metrics.peroxide) / 2) * weights.peroxide * 100;
  return Math.min(100, Math.max(0, Math.round(score)));
};

export const getPurityLabel = (score) => {
  if (score >= 95) return { label: 'Exceptional', color: 'text-natural' };
  if (score >= 85) return { label: 'Excellent', color: 'text-gold' };
  if (score >= 70) return { label: 'Good', color: 'text-coconut-light' };
  return { label: 'Standard', color: 'text-coconut-light' };
};

export const cn = (...classes) => classes.filter(Boolean).join(' ');
