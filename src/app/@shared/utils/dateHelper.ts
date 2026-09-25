export function convertDateTime(value: any) {
  // convert date time like createdAt to MM/dd/YYYY
  const date = new Date(value);

  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
}
