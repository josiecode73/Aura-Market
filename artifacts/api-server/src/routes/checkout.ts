import { Router, type IRouter } from "express";
import { db, ordersTable, orderItemsTable } from "@workspace/db";
import {
  CreateCheckoutSessionBody,
  CompleteCheckoutBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function getBaseUrl(): string {
  const domains = process.env.REPLIT_DOMAINS;
  if (domains) {
    const firstDomain = domains.split(",")[0].trim();
    return `https://${firstDomain}`;
  }
  return "http://localhost:80";
}

router.post("/checkout/session", async (req, res) => {
  try {
    const data = CreateCheckoutSessionBody.parse(req.body);

    const totalPrice = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const mockSessionId = `mock_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const [order] = await db
      .insert(ordersTable)
      .values({
        userEmail: data.userEmail,
        userName: data.userName ?? null,
        address: data.address ?? null,
        totalPrice: String(totalPrice),
        status: "completed",
        stripeSessionId: mockSessionId,
      })
      .returning();

    await Promise.all(
      data.items.map((item) =>
        db.insert(orderItemsTable).values({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
        })
      )
    );

    const baseUrl = getBaseUrl();
    const successUrl = `${baseUrl}/?success=true&session_id=${mockSessionId}&email=${encodeURIComponent(data.userEmail)}`;

    res.json({ url: successUrl, sessionId: mockSessionId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    res.status(500).json({ error: message });
  }
});

router.post("/checkout/success", async (req, res) => {
  try {
    const data = CompleteCheckoutBody.parse(req.body);

    const [order] = await db
      .insert(ordersTable)
      .values({
        userEmail: data.userEmail,
        totalPrice: String(data.totalPrice),
        status: "completed",
        stripeSessionId: data.sessionId,
      })
      .returning();

    await Promise.all(
      data.items.map((item) =>
        db.insert(orderItemsTable).values({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
        })
      )
    );

    res.json({
      ...order,
      totalPrice: parseFloat(order.totalPrice),
      createdAt: order.createdAt.toISOString(),
      items: data.items.map((item, i) => ({ id: i, orderId: order.id, ...item })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to complete checkout";
    res.status(500).json({ error: message });
  }
});

export default router;
