import { Router, type IRouter } from "express";
import { db, ordersTable, orderItemsTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateOrderBody,
  GetOrderParams,
  ListOrdersQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/orders", async (req, res) => {
  try {
    const query = ListOrdersQueryParams.parse(req.query);
    let orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    if (query.email) {
      orders = orders.filter((o) => o.userEmail === query.email);
    }
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await db
          .select({
            id: orderItemsTable.id,
            orderId: orderItemsTable.orderId,
            productId: orderItemsTable.productId,
            quantity: orderItemsTable.quantity,
            product: {
              id: productsTable.id,
              name: productsTable.name,
              description: productsTable.description,
              price: productsTable.price,
              image: productsTable.image,
              stock: productsTable.stock,
              category: productsTable.category,
              createdAt: productsTable.createdAt,
            },
          })
          .from(orderItemsTable)
          .leftJoin(productsTable, eq(orderItemsTable.productId, productsTable.id))
          .where(eq(orderItemsTable.orderId, order.id));
        return {
          ...order,
          totalPrice: parseFloat(order.totalPrice),
          createdAt: order.createdAt.toISOString(),
          items: items.map((item) => ({
            ...item,
            product: item.product
              ? { ...item.product, price: parseFloat(item.product.price), createdAt: item.product.createdAt.toISOString() }
              : undefined,
          })),
        };
      })
    );
    res.json(ordersWithItems);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = GetOrderParams.parse({ id: parseInt(req.params.id) });
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    const items = await db
      .select({
        id: orderItemsTable.id,
        orderId: orderItemsTable.orderId,
        productId: orderItemsTable.productId,
        quantity: orderItemsTable.quantity,
        product: {
          id: productsTable.id,
          name: productsTable.name,
          description: productsTable.description,
          price: productsTable.price,
          image: productsTable.image,
          stock: productsTable.stock,
          category: productsTable.category,
          createdAt: productsTable.createdAt,
        },
      })
      .from(orderItemsTable)
      .leftJoin(productsTable, eq(orderItemsTable.productId, productsTable.id))
      .where(eq(orderItemsTable.orderId, order.id));
    res.json({
      ...order,
      totalPrice: parseFloat(order.totalPrice),
      createdAt: order.createdAt.toISOString(),
      items: items.map((item) => ({
        ...item,
        product: item.product
          ? { ...item.product, price: parseFloat(item.product.price), createdAt: item.product.createdAt.toISOString() }
          : undefined,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const data = CreateOrderBody.parse(req.body);
    const [order] = await db
      .insert(ordersTable)
      .values({
        userEmail: data.userEmail,
        userName: data.userName ?? null,
        address: data.address ?? null,
        totalPrice: String(data.totalPrice),
        status: "pending",
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
    res.status(201).json({
      ...order,
      totalPrice: parseFloat(order.totalPrice),
      createdAt: order.createdAt.toISOString(),
      items: data.items.map((item, i) => ({ id: i, orderId: order.id, ...item })),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default router;
