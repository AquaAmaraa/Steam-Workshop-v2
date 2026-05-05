export default async function handler(req, res) {
  return res.status(410).json({ message: 'Email verification is no longer required.' });
}
