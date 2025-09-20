import React, { createContext, useContext, useState, ReactNode } from 'react';
import { faker } from '@faker-js/faker';

// Interfaces
interface ManufacturingOrder {
  id: string;
  orderNumber: string;
  item: string;
  productId: string;
  quantity: number;
  status: 'Planned' | 'In Progress' | 'Done' | 'Canceled';
  deadline: string;
  createdDate: string;
  progress: number;
  assignee: string;
  notes?: string;
}

interface WorkOrder {
  id: string;
  orderNumber: string;
  manufacturingOrderId: string;
  item: string;
  operation: string;
  assignedTo: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  startDate: string;
  estimatedHours: number;
  actualHours: number;
}

interface BOMComponent {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  operation: string;
}

interface BOM {
  id: string;
  productName: string;
  productCode: string;
  components: BOMComponent[];
  totalCost: number;
}

interface StockItem {
  id: string;
  productName: string;
  productCode: string;
  currentStock: number;
  unit: string;
  lastUpdated: string;
  location: string;
}

interface StockMovement {
    id: string;
    productId: string;
    productName: string;
    type: 'In' | 'Out';
    quantity: number;
    reference: string;
    notes?: string;
    date: string;
}

interface WorkCenter {
  id: string;
  name: string;
  location: string;
  description: string;
  costPerHour: number;
  capacity: number;
  utilization: number;
  status: 'Active' | 'Maintenance' | 'Inactive';
}

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  unitPrice: number;
  stockQuantity: number;
  minStockLevel: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Operator' | 'Inventory';
  department: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  phone: string;
  createdDate: string;
}

// Data Context Type
interface DataContextType {
  manufacturingOrders: ManufacturingOrder[];
  workOrders: WorkOrder[];
  boms: BOM[];
  stockItems: StockItem[];
  stockMovements: StockMovement[];
  workCenters: WorkCenter[];
  products: Product[];
  users: User[];
  addManufacturingOrder: (order: Omit<ManufacturingOrder, 'id' | 'orderNumber' | 'progress' | 'createdDate' | 'status'>) => void;
  updateManufacturingOrder: (id: string, updates: Partial<ManufacturingOrder>) => void;
  addWorkOrder: (order: Omit<WorkOrder, 'id' | 'orderNumber' | 'status' | 'startDate' | 'actualHours'>) => void;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  addBOM: (bom: Omit<BOM, 'id'>) => void;
  addComponentToBOM: (data: { parentProductId: string; componentProductId: string; quantity: number; operation: string; }) => void;
  addStockItem: (item: Omit<StockItem, 'id'>) => void;
  updateStockItem: (id: string, updates: Partial<StockItem>) => void;
  recordStockMovement: (movement: Omit<StockMovement, 'id' | 'date' | 'productName'>) => void;
  addWorkCenter: (center: Omit<WorkCenter, 'id' | 'utilization' | 'status' | 'description'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addUser: (user: Omit<User, 'id' | 'createdDate'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Generate initial data
const generateInitialData = () => {
  const statuses: Array<'Planned' | 'In Progress' | 'Done' | 'Canceled'> = ['Planned', 'In Progress', 'Done', 'Canceled'];
  const workOrderStatuses: Array<'Not Started' | 'In Progress' | 'Completed' | 'On Hold'> = ['Not Started', 'In Progress', 'Completed', 'On Hold'];
  const operations = ['Assembly', 'Welding', 'Painting', 'Cutting', 'Finishing'];
  const userRoles: Array<'Admin' | 'Manager' | 'Operator' | 'Inventory'> = ['Admin', 'Manager', 'Operator', 'Inventory'];
  const userStatuses: Array<'Active' | 'Inactive' | 'Suspended'> = ['Active', 'Inactive', 'Suspended'];
  const departments = ['Production', 'Inventory', 'Logistics', 'Administration'];

  const products: Product[] = Array.from({ length: 30 }, (_, i) => ({
    id: `PROD-${String(i + 1).padStart(4, '0')}`,
    name: faker.commerce.productName(),
    category: faker.commerce.department(),
    description: faker.commerce.productDescription(),
    unitPrice: parseFloat(faker.commerce.price({ min: 10, max: 2000 })),
    stockQuantity: faker.number.int({ min: 0, max: 500 }),
    minStockLevel: faker.number.int({ min: 20, max: 100 }),
  }));
  
  const manufacturingOrders: ManufacturingOrder[] = Array.from({ length: 12 }, (_, i) => {
    const product = products[Math.floor(Math.random() * products.length)];
    return {
        id: `MO-${String(i + 1).padStart(3, '0')}`,
        orderNumber: `MO-${faker.number.int({ min: 1000, max: 9999 })}`,
        item: product.name,
        productId: product.id,
        quantity: faker.number.int({ min: 10, max: 500 }),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        deadline: faker.date.future().toISOString().split('T')[0],
        createdDate: faker.date.past().toISOString().split('T')[0],
        progress: faker.number.int({ min: 0, max: 100 }),
        assignee: faker.person.fullName(),
    }
  });

  const workOrders: WorkOrder[] = Array.from({ length: 20 }, (_, i) => ({
    id: `WO-${String(i + 1).padStart(3, '0')}`,
    orderNumber: `WO-${faker.number.int({ min: 1000, max: 9999 })}`,
    manufacturingOrderId: manufacturingOrders[Math.floor(Math.random() * manufacturingOrders.length)].id,
    item: products[Math.floor(Math.random() * products.length)].name,
    operation: operations[Math.floor(Math.random() * operations.length)],
    assignedTo: faker.person.fullName(),
    status: workOrderStatuses[Math.floor(Math.random() * workOrderStatuses.length)],
    startDate: faker.date.recent().toISOString().split('T')[0],
    estimatedHours: faker.number.int({ min: 2, max: 16 }),
    actualHours: faker.number.int({ min: 1, max: 20 })
  }));

  const boms: BOM[] = Array.from({ length: 8 }, (_, i) => {
    const parentProduct = products[i];
    const components = Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, (_, j) => {
      const componentProduct = products[faker.number.int({ min: 10, max: products.length - 1 })];
      return {
        id: `COMP-${i}-${j}`,
        name: componentProduct.name,
        quantity: faker.number.int({ min: 1, max: 10 }),
        unit: ['pcs', 'kg', 'liters', 'meters'][Math.floor(Math.random() * 4)],
        cost: componentProduct.unitPrice,
        operation: operations[Math.floor(Math.random() * operations.length)]
      };
    });
    
    return {
      id: parentProduct.id, // Use parent product ID as BOM ID for simplicity
      productName: parentProduct.name,
      productCode: `PROD-CODE-${parentProduct.id}`,
      components,
      totalCost: components.reduce((sum, comp) => sum + (comp.cost * comp.quantity), 0)
    };
  });

  const stockItems: StockItem[] = products.map(p => ({
    id: `STK-${p.id}`,
    productName: p.name,
    productCode: `PROD-CODE-${p.id}`,
    currentStock: p.stockQuantity,
    unit: ['pcs', 'kg', 'liters', 'meters'][Math.floor(Math.random() * 4)],
    lastUpdated: faker.date.recent().toISOString().split('T')[0],
    location: `Warehouse ${faker.string.alpha(1).toUpperCase()}`
  }));

  const stockMovements: StockMovement[] = Array.from({ length: 50 }, () => {
    const product = products[faker.number.int({ max: products.length - 1 })];
    return {
        id: `SM-${faker.string.uuid()}`,
        productId: product.id,
        productName: product.name,
        type: faker.helpers.arrayElement(['In', 'Out']),
        quantity: faker.number.int({ min: 1, max: 100 }),
        reference: `PO-${faker.number.int({ min: 1000, max: 2000 })}`,
        date: faker.date.recent({ days: 90 }).toISOString().split('T')[0],
        notes: faker.lorem.sentence(),
    };
  });

  const workCenters: WorkCenter[] = Array.from({ length: 6 }, (_, i) => ({
    id: `WC-${String(i + 1).padStart(3, '0')}`,
    name: `Work Center ${i + 1}`,
    location: `Building ${faker.string.alpha(1).toUpperCase()}`,
    description: ['CNC Machine', 'Welding Station', 'Assembly Line', 'Paint Booth', 'Quality Control', 'Packaging'][i],
    costPerHour: parseFloat(faker.commerce.price({ min: 50, max: 200 })),
    capacity: faker.number.int({ min: 8, max: 24 }),
    utilization: faker.number.int({ min: 40, max: 95 }),
    status: ['Active', 'Maintenance', 'Inactive'][Math.floor(Math.random() * 3)] as 'Active' | 'Maintenance' | 'Inactive'
  }));

  const users: User[] = Array.from({ length: 15 }, (_, i) => ({
    id: `USER-${String(i + 1).padStart(3, '0')}`,
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    role: userRoles[Math.floor(Math.random() * userRoles.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    status: userStatuses[Math.floor(Math.random() * userStatuses.length)],
    phone: faker.phone.number(),
    createdDate: faker.date.past().toISOString().split('T')[0],
  }));

  return { manufacturingOrders, workOrders, boms, stockItems, stockMovements, workCenters, products, users };
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState(generateInitialData);

  const addManufacturingOrder = (order: Omit<ManufacturingOrder, 'id' | 'orderNumber' | 'progress' | 'createdDate' | 'status'>) => {
    const newOrder: ManufacturingOrder = {
      ...order,
      id: `MO-${String(data.manufacturingOrders.length + 1).padStart(3, '0')}`,
      orderNumber: `MO-${faker.number.int({ min: 1000, max: 9999 })}`,
      progress: 0,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Planned',
    };
    setData(prev => ({
      ...prev,
      manufacturingOrders: [newOrder, ...prev.manufacturingOrders]
    }));
  };

  const updateManufacturingOrder = (id: string, updates: Partial<ManufacturingOrder>) => {
    setData(prev => ({
      ...prev,
      manufacturingOrders: prev.manufacturingOrders.map(order =>
        order.id === id ? { ...order, ...updates } : order
      )
    }));
  };

  const addWorkOrder = (order: Omit<WorkOrder, 'id' | 'orderNumber' | 'status' | 'startDate' | 'actualHours'>) => {
    const newOrder: WorkOrder = {
      ...order,
      id: `WO-${String(data.workOrders.length + 1).padStart(3, '0')}`,
      orderNumber: `WO-${faker.number.int({ min: 1000, max: 9999 })}`,
      status: 'Not Started',
      startDate: new Date().toISOString().split('T')[0],
      actualHours: 0,
    };
    setData(prev => ({
      ...prev,
      workOrders: [newOrder, ...prev.workOrders]
    }));
  };

  const updateWorkOrder = (id: string, updates: Partial<WorkOrder>) => {
    setData(prev => ({
      ...prev,
      workOrders: prev.workOrders.map(order =>
        order.id === id ? { ...order, ...updates } : order
      )
    }));
  };

  const addBOM = (bom: Omit<BOM, 'id'>) => {
    const newBOM = {
      ...bom,
      id: `BOM-${String(data.boms.length + 1).padStart(3, '0')}`
    };
    setData(prev => ({
      ...prev,
      boms: [newBOM, ...prev.boms]
    }));
  };
  
  const addComponentToBOM = (componentData: { parentProductId: string; componentProductId: string; quantity: number; operation: string; }) => {
    setData(prev => {
      const parentProduct = prev.products.find(p => p.id === componentData.parentProductId);
      const componentProduct = prev.products.find(p => p.id === componentData.componentProductId);

      if (!parentProduct || !componentProduct) return prev;

      const newComponent: BOMComponent = {
        id: `COMP-${Date.now()}`,
        name: componentProduct.name,
        quantity: componentData.quantity,
        unit: 'pcs', // Default unit
        cost: componentProduct.unitPrice,
        operation: componentData.operation
      };

      const existingBOMIndex = prev.boms.findIndex(b => b.id === parentProduct.id);

      let newBoms = [...prev.boms];

      if (existingBOMIndex > -1) {
        // Update existing BOM
        const updatedBOM = { ...newBoms[existingBOMIndex] };
        updatedBOM.components = [...updatedBOM.components, newComponent];
        updatedBOM.totalCost = updatedBOM.components.reduce((sum, comp) => sum + (comp.cost * comp.quantity), 0);
        newBoms[existingBOMIndex] = updatedBOM;
      } else {
        // Create new BOM
        const newBOM: BOM = {
          id: parentProduct.id,
          productName: parentProduct.name,
          productCode: `PROD-CODE-${parentProduct.id}`,
          components: [newComponent],
          totalCost: newComponent.cost * newComponent.quantity
        };
        newBoms = [newBOM, ...newBoms];
      }

      return { ...prev, boms: newBoms };
    });
  };

  const addStockItem = (item: Omit<StockItem, 'id'>) => {
    const newItem = {
      ...item,
      id: `STK-${String(data.stockItems.length + 1).padStart(3, '0')}`
    };
    setData(prev => ({
      ...prev,
      stockItems: [newItem, ...prev.stockItems]
    }));
  };

  const updateStockItem = (id: string, updates: Partial<StockItem>) => {
    setData(prev => ({
      ...prev,
      stockItems: prev.stockItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const recordStockMovement = (movement: Omit<StockMovement, 'id' | 'date' | 'productName'>) => {
    setData(prev => {
        const product = prev.products.find(p => p.id === movement.productId);
        if (!product) return prev;

        const newMovement: StockMovement = {
            ...movement,
            id: `SM-${faker.string.uuid()}`,
            date: new Date().toISOString().split('T')[0],
            productName: product.name,
        };

        const updatedProducts = prev.products.map(p => {
            if (p.id === movement.productId) {
                const newStock = movement.type === 'In'
                    ? p.stockQuantity + movement.quantity
                    : p.stockQuantity - movement.quantity;
                return { ...p, stockQuantity: Math.max(0, newStock) };
            }
            return p;
        });

        const updatedStockItems = prev.stockItems.map(si => {
            const relatedProduct = updatedProducts.find(p => `PROD-CODE-${p.id}` === si.productCode);
            if (relatedProduct) {
                return { ...si, currentStock: relatedProduct.stockQuantity, lastUpdated: newMovement.date };
            }
            return si;
        });

        return {
            ...prev,
            products: updatedProducts,
            stockItems: updatedStockItems,
            stockMovements: [newMovement, ...prev.stockMovements],
        };
    });
  };

  const addWorkCenter = (center: Omit<WorkCenter, 'id' | 'utilization' | 'status' | 'description'>) => {
    const newCenter: WorkCenter = {
      ...center,
      id: `WC-${String(data.workCenters.length + 1).padStart(3, '0')}`,
      utilization: 0,
      status: 'Active',
      description: 'Newly added work center',
    };
    setData(prev => ({
      ...prev,
      workCenters: [newCenter, ...prev.workCenters]
    }));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `PROD-${String(data.products.length + 1).padStart(4, '0')}`
    };
    const newStockItem: StockItem = {
        id: `STK-${newProduct.id}`,
        productName: newProduct.name,
        productCode: `PROD-CODE-${newProduct.id}`,
        currentStock: newProduct.stockQuantity,
        unit: 'pcs',
        lastUpdated: new Date().toISOString().split('T')[0],
        location: `Warehouse ${faker.string.alpha(1).toUpperCase()}`
    };
    setData(prev => ({
      ...prev,
      products: [newProduct, ...prev.products],
      stockItems: [newStockItem, ...prev.stockItems],
    }));
  };

  const addUser = (user: Omit<User, 'id' | 'createdDate'>) => {
    const newUser: User = {
      ...user,
      id: `USER-${String(data.users.length + 1).padStart(3, '0')}`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setData(prev => ({
      ...prev,
      users: [newUser, ...prev.users]
    }));
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(user =>
        user.id === id ? { ...user, ...updates } : user
      )
    }));
  };

  const deleteUser = (id: string) => {
    setData(prev => ({
      ...prev,
      users: prev.users.filter(user => user.id !== id)
    }));
  };

  return (
    <DataContext.Provider value={{
      ...data,
      addManufacturingOrder,
      updateManufacturingOrder,
      addWorkOrder,
      updateWorkOrder,
      addBOM,
      addComponentToBOM,
      addStockItem,
      updateStockItem,
      recordStockMovement,
      addWorkCenter,
      addProduct,
      addUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </DataContext.Provider>
  );
};
