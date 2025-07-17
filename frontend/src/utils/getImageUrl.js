
export default function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `http://localhost:5000/${path.replace(/^\/+/, '')}`;
}
