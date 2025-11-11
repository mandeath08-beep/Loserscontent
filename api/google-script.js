export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzhi65mzn7Y23aDPmiHLQQrwqDSsxV_uLg8TekOFeuoEFr0IrEDXzmMEI8MCvPPEpwA/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    const text = await response.text(); // read raw text (not always valid JSON)
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: "Proxy failed" });
  }
}
