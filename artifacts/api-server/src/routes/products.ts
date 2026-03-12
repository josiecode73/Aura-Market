import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, asc, desc } from "drizzle-orm";
import {
  CreateProductBody,
  UpdateProductBody,
  GetProductParams,
  UpdateProductParams,
  DeleteProductParams,
  ListProductsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/products", async (req, res) => {
  try {
    const query = ListProductsQueryParams.parse(req.query);
    let products = await db.select().from(productsTable);
    if (query.category) {
      products = products.filter((p) => p.category === query.category);
    }
    if (query.sort === "price_asc") {
      products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (query.sort === "price_desc") {
      products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (query.sort === "name_asc") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }
    res.json(
      products.map((p) => ({
        ...p,
        price: parseFloat(p.price),
        createdAt: p.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const { id } = GetProductParams.parse({ id: parseInt(req.params.id) });
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ ...product, price: parseFloat(product.price), createdAt: product.createdAt.toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const data = CreateProductBody.parse(req.body);
    const [product] = await db
      .insert(productsTable)
      .values({
        name: data.name,
        description: data.description,
        price: String(data.price),
        image: data.image ?? null,
        stock: data.stock,
        category: data.category ?? null,
      })
      .returning();
    res.status(201).json({ ...product, price: parseFloat(product.price), createdAt: product.createdAt.toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const { id } = UpdateProductParams.parse({ id: parseInt(req.params.id) });
    const data = UpdateProductBody.parse(req.body);
    const [product] = await db
      .update(productsTable)
      .set({
        name: data.name,
        description: data.description,
        price: String(data.price),
        image: data.image ?? null,
        stock: data.stock,
        category: data.category ?? null,
      })
      .where(eq(productsTable.id, id))
      .returning();
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ ...product, price: parseFloat(product.price), createdAt: product.createdAt.toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = DeleteProductParams.parse({ id: parseInt(req.params.id) });
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
