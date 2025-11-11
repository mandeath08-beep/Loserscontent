export default async function handler(req, res) {
  const targetUrl = "https://script.google.com/macros/s/AKfycbzhi65mzn7Y23aDPmiHLQQrwqDSsxV_uLg8TekOFeuoEFr0IrEDXzmMEI8MCvPPEpwA/exec";

  try {
    const fetchRes = await fetch(targetUrl, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
    });

    const text = await fetchRes.text();

    res.setHeader("Access-Control-Allow-Origin", "https://loserscontent.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(204).end();

    res.status(fetchRes.status).send(text);
  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", "https://loserscontent.vercel.app");
    res.status(500).json({ error: err.message });
  }
}

