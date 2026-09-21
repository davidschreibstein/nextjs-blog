// Example API route — available at /api/hello
// req = incoming request; res = response you send back
export default function handler(req, res) {
  // Send HTTP 200 with a small JSON body
  res.status(200).json({ text: 'Hello' });
}
