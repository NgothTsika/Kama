"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const prisma_1 = __importDefault(require("./utils/prisma"));
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
const server = app_1.default.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(async () => {
        console.log("HTTP server closed");
        await prisma_1.default.$disconnect();
        process.exit(0);
    });
});
process.on("SIGINT", async () => {
    console.log("SIGINT signal received: closing HTTP server");
    server.close(async () => {
        console.log("HTTP server closed");
        await prisma_1.default.$disconnect();
        process.exit(0);
    });
});
// Handle uncaught errors
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await prisma_1.default.$disconnect();
    process.exit(1);
});
process.on("unhandledRejection", async (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    await prisma_1.default.$disconnect();
    process.exit(1);
});
exports.default = server;
//# sourceMappingURL=index.js.map