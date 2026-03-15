import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { total } = req.body;

    const payment = await mercadopago.payment.create({
      transaction_amount: Number(total),
      payment_method_id: "pix",
      payer: {
        email: "cliente@nortecoxinha.com"
      }
    });

    res.status(200).json({
      qr_code: payment.body.point_of_interaction.transaction_data.qr_code,
      qr_code_base64:
        payment.body.point_of_interaction.transaction_data.qr_code_base64
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}