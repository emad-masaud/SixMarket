export default function timeAgo(dateString: Date) {
  const now: any = new Date();
  const createdAt: any = new Date(dateString);
  const seconds = Math.floor((now - createdAt) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `من ${days} يوم`;
  } else if (hours > 0) {
    return `من ${hours} ساعة`;
  } else if (minutes > 0) {
    return `من ${minutes} دقيقة`;
  } else {
    return `من ${seconds} ثانية`;
  }
}
