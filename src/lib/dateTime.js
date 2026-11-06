export const getCurrentDateString = () => {
  return new Date().toISOString().split('T')[0];
};

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};