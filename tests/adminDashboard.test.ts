import "./setupDb";
import { describe, it, expect, afterAll } from "vitest";
import { disconnectDb } from "./setupDb";

afterAll(disconnectDb);

describe("admin dashboard summary", () => {
  it("returns counts and recent orders from seeded data", async () => {
    const { getAdminDashboardStats } = await import("../src/lib/queries/adminDashboard");
    const stats = await getAdminDashboardStats();

    expect(stats.ordersTotal).toBeGreaterThan(0);
    expect(stats.productsTotal).toBeGreaterThan(0);
    expect(stats.categoriesTotal).toBeGreaterThan(0);
    expect(stats.recentOrders.length).toBeGreaterThan(0);
  });
});
