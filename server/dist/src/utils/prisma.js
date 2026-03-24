"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
// Create PostgreSQL connection pool
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Create Prisma adapter
const adapter = new adapter_pg_1.PrismaPg(pool);
// Create Prisma Client with pg adapter
const prisma = new client_1.PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
});
exports.default = prisma;
//# sourceMappingURL=prisma.js.map