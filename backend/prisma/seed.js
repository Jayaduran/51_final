"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    const hashedPassword = await bcryptjs_1.default.hash('admin123', 12);
    const adminUser = await prisma.user.upsert({
        where: { loginId: 'admin' },
        update: {},
        create: {
            loginId: 'admin',
            email: 'admin@manufactureflow.com',
            password: hashedPassword,
            name: 'Manufacturing Admin',
            role: 'ADMIN',
            department: 'Administration',
            status: 'ACTIVE',
            phone: '+1-555-0123'
        }
    });
    console.log('✅ Admin user created:', adminUser.loginId);
    const products = await Promise.all([
        prisma.product.upsert({
            where: { id: 'PROD-0001' },
            update: {},
            create: {
                id: 'PROD-0001',
                name: 'Steel Rod 12mm',
                category: 'Raw Materials',
                description: 'High-grade steel rod for manufacturing',
                unitPrice: 25.50,
                stockQuantity: 500,
                minStockLevel: 50
            }
        }),
        prisma.product.upsert({
            where: { id: 'PROD-0002' },
            update: {},
            create: {
                id: 'PROD-0002',
                name: 'Aluminum Sheet 2mm',
                category: 'Raw Materials',
                description: 'Lightweight aluminum sheet',
                unitPrice: 45.00,
                stockQuantity: 200,
                minStockLevel: 30
            }
        }),
        prisma.product.upsert({
            where: { id: 'PROD-0003' },
            update: {},
            create: {
                id: 'PROD-0003',
                name: 'Finished Widget A',
                category: 'Finished Products',
                description: 'Complete manufactured widget',
                unitPrice: 150.00,
                stockQuantity: 50,
                minStockLevel: 10
            }
        })
    ]);
    console.log('✅ Sample products created:', products.length);
    const manufacturingOrders = await Promise.all([
        prisma.manufacturingOrder.upsert({
            where: { id: 'MO-001' },
            update: {},
            create: {
                id: 'MO-001',
                orderNumber: 'MO-2024001',
                item: 'Widget A Production',
                productId: 'PROD-0003',
                quantity: 100,
                status: 'PLANNED',
                deadline: new Date('2024-02-15'),
                progress: 0,
                assignee: 'Production Team A',
                notes: 'Priority order for Q1 delivery'
            }
        }),
        prisma.manufacturingOrder.upsert({
            where: { id: 'MO-002' },
            update: {},
            create: {
                id: 'MO-002',
                orderNumber: 'MO-2024002',
                item: 'Widget B Production',
                productId: 'PROD-0003',
                quantity: 50,
                status: 'IN_PROGRESS',
                deadline: new Date('2024-01-30'),
                progress: 45,
                assignee: 'Production Team B',
                notes: 'In progress - on track'
            }
        })
    ]);
    console.log('✅ Sample manufacturing orders created:', manufacturingOrders.length);
    const workCenters = await Promise.all([
        prisma.workCenter.upsert({
            where: { id: 'WC-001' },
            update: {},
            create: {
                id: 'WC-001',
                name: 'CNC Machine Center',
                location: 'Building A',
                description: 'High-precision CNC machining center',
                costPerHour: 75.00,
                capacity: 16,
                utilization: 85,
                status: 'ACTIVE'
            }
        }),
        prisma.workCenter.upsert({
            where: { id: 'WC-002' },
            update: {},
            create: {
                id: 'WC-002',
                name: 'Assembly Line 1',
                location: 'Building B',
                description: 'Main assembly line for finished products',
                costPerHour: 50.00,
                capacity: 24,
                utilization: 70,
                status: 'ACTIVE'
            }
        })
    ]);
    console.log('✅ Sample work centers created:', workCenters.length);
    const bom = await prisma.bOM.upsert({
        where: { id: 'BOM-001' },
        update: {},
        create: {
            id: 'BOM-001',
            productName: 'Finished Widget A',
            productCode: 'PROD-CODE-PROD-0003',
            totalCost: 120.50
        }
    });
    await Promise.all([
        prisma.bOMComponent.upsert({
            where: { id: 'COMP-001' },
            update: {},
            create: {
                id: 'COMP-001',
                bomId: 'BOM-001',
                productId: 'PROD-0001',
                name: 'Steel Rod 12mm',
                quantity: 2,
                unit: 'pcs',
                cost: 25.50,
                operation: 'Cutting'
            }
        }),
        prisma.bOMComponent.upsert({
            where: { id: 'COMP-002' },
            update: {},
            create: {
                id: 'COMP-002',
                bomId: 'BOM-001',
                productId: 'PROD-0002',
                name: 'Aluminum Sheet 2mm',
                quantity: 1,
                unit: 'pcs',
                cost: 45.00,
                operation: 'Forming'
            }
        })
    ]);
    console.log('✅ Sample BOM created');
    await Promise.all([
        prisma.stockItem.upsert({
            where: { id: 'STK-001' },
            update: {},
            create: {
                id: 'STK-001',
                productName: 'Steel Rod 12mm',
                productCode: 'PROD-CODE-PROD-0001',
                currentStock: 500,
                unit: 'pcs',
                location: 'Warehouse A'
            }
        }),
        prisma.stockItem.upsert({
            where: { id: 'STK-002' },
            update: {},
            create: {
                id: 'STK-002',
                productName: 'Aluminum Sheet 2mm',
                productCode: 'PROD-CODE-PROD-0002',
                currentStock: 200,
                unit: 'pcs',
                location: 'Warehouse B'
            }
        })
    ]);
    console.log('✅ Sample stock items created');
    console.log('🎉 Database seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map