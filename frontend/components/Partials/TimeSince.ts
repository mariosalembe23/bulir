function timeSince(dateInput: string | Date): string {
  const now = new Date();
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) return "no futuro";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `há ${days}d`;
  if (hours > 0) return `há ${hours}h`;
  if (minutes > 0) return `há ${minutes}min`;
  if (seconds > 5) return `há ${seconds}s`;

  return "agora";
}

export default timeSince;
