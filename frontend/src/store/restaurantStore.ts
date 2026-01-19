/**
 * Restaurant Store
 * State management using Zustand with instrumentation
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { logStateChange } from '../services/instrumentation';
import type {
  MenuItem,
  Ingredient,
  Supplier,
  Order,
  OrderItem,
  Staff,
  Table,
  Reservation,
  Customer,
  Alert,
  PurchaseOrder,
  Expense,
  OrderStatus,
  OrderItemStatus,
} from '../types/restaurant';

// Store State Interface
interface RestaurantState {
  // Data
  menuItems: MenuItem[];
  ingredients: Ingredient[];
  suppliers: Supplier[];
  orders: Order[];
  staff: Staff[];
  tables: Table[];
  reservations: Reservation[];
  customers: Customer[];
  alerts: Alert[];
  purchaseOrders: PurchaseOrder[];
  expenses: Expense[];
  
  // UI State
  isLoading: boolean;
  selectedItem: string | null;
  
  // Menu Item Actions
  addMenuItem: (item: MenuItem | Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => MenuItem;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  
  // Ingredient Actions
  addIngredient: (item: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>) => Ingredient;
  updateIngredient: (id: string, updates: Partial<Ingredient>) => void;
  deleteIngredient: (id: string) => void;
  
  // Supplier Actions
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => Supplier;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  // Order Actions
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  createOrder: (tableId?: string, customerName?: string) => Order;
  addItemToOrder: (orderId: string, menuItemId: string, quantity: number, instructions?: string) => void;
  removeItemFromOrder: (orderId: string, orderItemId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderItemStatus: (orderId: string, itemId: string, status: OrderItemStatus) => void;
  completeOrder: (orderId: string, paymentMethod: Order['paymentMethod'], tip?: number) => void;
  cancelOrder: (orderId: string) => void;
  
  // Staff Actions
  addStaff: (staff: Staff | Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>) => Staff;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  
  // Table Actions
  addTable: (table: Table | Omit<Table, 'id'>) => Table;
  updateTable: (id: string, updates: Partial<Table>) => void;
  deleteTable: (id: string) => void;
  updateTableStatus: (id: string, status: Table['status'], orderId?: string) => void;
  
  // Reservation Actions
  addReservation: (reservation: Reservation | Omit<Reservation, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Reservation;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
  cancelReservation: (id: string) => void;
  
  // Alert Actions
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'read'>) => void;
  markAlertRead: (id: string) => void;
  clearAlerts: () => void;
  
  // Utility
  setSelectedItem: (id: string | null) => void;
  loadSampleData: () => void;
}

// Create the store
export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  // Initial State
  menuItems: [],
  ingredients: [],
  suppliers: [],
  orders: [],
  staff: [],
  tables: [],
  reservations: [],
  customers: [],
  alerts: [],
  purchaseOrders: [],
  expenses: [],
  isLoading: false,
  selectedItem: null,
  
  // Menu Item Actions
  addMenuItem: (itemData) => {
    const now = new Date().toISOString();
    const newItem: MenuItem = {
      ...itemData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    set((state) => {
      const newState = { menuItems: [...state.menuItems, newItem] };
      logStateChange('set', 'menuItems/add', 'addMenuItem', undefined, newItem);
      return newState;
    });
    
    return newItem;
  },
  
  updateMenuItem: (id, updates) => {
    set((state) => {
      const index = state.menuItems.findIndex((item) => item.id === id);
      if (index === -1) return state;
      
      const oldItem = state.menuItems[index];
      const updatedItem = { ...oldItem, ...updates, updatedAt: Date.now() };
      const newMenuItems = [...state.menuItems];
      newMenuItems[index] = updatedItem;
      
      logStateChange('update', `menuItems/${id}`, 'updateMenuItem', oldItem, updatedItem);
      
      return { menuItems: newMenuItems };
    });
  },
  
  deleteMenuItem: (id) => {
    set((state) => {
      const item = state.menuItems.find((i) => i.id === id);
      const newMenuItems = state.menuItems.filter((i) => i.id !== id);
      
      logStateChange('delete', `menuItems/${id}`, 'deleteMenuItem', item, undefined);
      
      return { menuItems: newMenuItems };
    });
  },
  
  // Ingredient Actions
  addIngredient: (ingredientData) => {
    const now = Date.now();
    const newIngredient: Ingredient = {
      ...ingredientData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    set((state) => {
      logStateChange('set', 'ingredients/add', 'addIngredient', undefined, newIngredient);
      return { ingredients: [...state.ingredients, newIngredient] };
    });
    
    // Check for low stock alert
    if (newIngredient.quantity <= newIngredient.minQuantity) {
      get().addAlert({
        type: 'low_stock',
        title: 'Low Stock Alert',
        message: `${newIngredient.name} is running low (${newIngredient.quantity} ${newIngredient.unit} remaining)`,
        severity: 'warning',
      });
    }
    
    return newIngredient;
  },
  
  updateIngredient: (id, updates) => {
    set((state) => {
      const index = state.ingredients.findIndex((item) => item.id === id);
      if (index === -1) return state;
      
      const oldItem = state.ingredients[index];
      const updatedItem = { ...oldItem, ...updates, updatedAt: Date.now() };
      const newIngredients = [...state.ingredients];
      newIngredients[index] = updatedItem;
      
      logStateChange('update', `ingredients/${id}`, 'updateIngredient', oldItem, updatedItem);
      
      return { ingredients: newIngredients };
    });
  },
  
  deleteIngredient: (id) => {
    set((state) => {
      const item = state.ingredients.find((i) => i.id === id);
      logStateChange('delete', `ingredients/${id}`, 'deleteIngredient', item, undefined);
      return { ingredients: state.ingredients.filter((i) => i.id !== id) };
    });
  },
  
  // Supplier Actions
  addSupplier: (supplierData) => {
    const now = Date.now();
    const newSupplier: Supplier = {
      ...supplierData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    set((state) => {
      logStateChange('set', 'suppliers/add', 'addSupplier', undefined, newSupplier);
      return { suppliers: [...state.suppliers, newSupplier] };
    });
    
    return newSupplier;
  },
  
  updateSupplier: (id, updates) => {
    set((state) => {
      const index = state.suppliers.findIndex((item) => item.id === id);
      if (index === -1) return state;
      
      const oldItem = state.suppliers[index];
      const updatedItem = { ...oldItem, ...updates, updatedAt: Date.now() };
      const newSuppliers = [...state.suppliers];
      newSuppliers[index] = updatedItem;
      
      logStateChange('update', `suppliers/${id}`, 'updateSupplier', oldItem, updatedItem);
      
      return { suppliers: newSuppliers };
    });
  },
  
  deleteSupplier: (id) => {
    set((state) => {
      const item = state.suppliers.find((i) => i.id === id);
      logStateChange('delete', `suppliers/${id}`, 'deleteSupplier', item, undefined);
      return { suppliers: state.suppliers.filter((i) => i.id !== id) };
    });
  },
  
  // Order Actions
  addOrder: (order) => {
    set((state) => {
      logStateChange('set', 'orders/add', 'addOrder', undefined, order);
      return { orders: [...state.orders, order] };
    });
  },

  updateOrder: (id, updates) => {
    set((state) => {
      const index = state.orders.findIndex((o) => o.id === id);
      if (index === -1) return state;
      
      const oldOrder = state.orders[index];
      const updatedOrder = { ...oldOrder, ...updates, updatedAt: new Date().toISOString() };
      const newOrders = [...state.orders];
      newOrders[index] = updatedOrder;
      
      logStateChange('update', `orders/${id}`, 'updateOrder', oldOrder, updatedOrder);
      
      return { orders: newOrders };
    });
  },

  deleteOrder: (id) => {
    set((state) => {
      const order = state.orders.find((o) => o.id === id);
      logStateChange('delete', `orders/${id}`, 'deleteOrder', order, undefined);
      return { orders: state.orders.filter((o) => o.id !== id) };
    });
  },

  createOrder: (tableId, customerName) => {
    const now = new Date().toISOString();
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    
    const newOrder: Order = {
      id: uuidv4(),
      orderNumber,
      tableId,
      customerName,
      items: [],
      status: 'pending',
      subtotal: 0,
      tax: 0,
      totalAmount: 0,
      paymentStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    
    set((state) => {
      logStateChange('set', 'orders/create', 'createOrder', undefined, newOrder);
      return { orders: [...state.orders, newOrder] };
    });
    
    // Update table status if assigned
    if (tableId) {
      const table = get().tables.find((t) => t.id === tableId);
      if (table) {
        get().updateTableStatus(table.id, 'occupied', newOrder.id);
      }
    }
    
    return newOrder;
  },
  
  addItemToOrder: (orderId, menuItemId, quantity, instructions) => {
    const menuItem = get().menuItems.find((m) => m.id === menuItemId);
    if (!menuItem) return;
    
    const orderItem: OrderItem = {
      id: uuidv4(),
      menuItemId,
      menuItemName: menuItem.name,
      quantity,
      unitPrice: menuItem.price,
      totalPrice: menuItem.price * quantity,
      specialInstructions: instructions,
      status: 'pending',
    };
    
    set((state) => {
      const orderIndex = state.orders.findIndex((o) => o.id === orderId);
      if (orderIndex === -1) return state;
      
      const order = state.orders[orderIndex];
      const newItems = [...order.items, orderItem];
      const subtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const tax = subtotal * 0.1; // 10% tax
      
      const updatedOrder = {
        ...order,
        items: newItems,
        subtotal,
        tax,
        total: subtotal + tax,
        updatedAt: Date.now(),
      };
      
      const newOrders = [...state.orders];
      newOrders[orderIndex] = updatedOrder;
      
      logStateChange('update', `orders/${orderId}/items`, 'addItemToOrder', order.items, newItems);
      
      return { orders: newOrders };
    });
  },
  
  removeItemFromOrder: (orderId, orderItemId) => {
    set((state) => {
      const orderIndex = state.orders.findIndex((o) => o.id === orderId);
      if (orderIndex === -1) return state;
      
      const order = state.orders[orderIndex];
      const newItems = order.items.filter((i) => i.id !== orderItemId);
      const subtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const tax = subtotal * 0.1;
      
      const updatedOrder = {
        ...order,
        items: newItems,
        subtotal,
        tax,
        total: subtotal + tax,
        updatedAt: Date.now(),
      };
      
      const newOrders = [...state.orders];
      newOrders[orderIndex] = updatedOrder;
      
      logStateChange('delete', `orders/${orderId}/items/${orderItemId}`, 'removeItemFromOrder', order.items, newItems);
      
      return { orders: newOrders };
    });
  },
  
  updateOrderStatus: (orderId, status) => {
    set((state) => {
      const orderIndex = state.orders.findIndex((o) => o.id === orderId);
      if (orderIndex === -1) return state;
      
      const order = state.orders[orderIndex];
      const updatedOrder = { ...order, status, updatedAt: Date.now() };
      const newOrders = [...state.orders];
      newOrders[orderIndex] = updatedOrder;
      
      logStateChange('update', `orders/${orderId}/status`, 'updateOrderStatus', order.status, status);
      
      return { orders: newOrders };
    });
    
    // Add alert for ready orders
    if (status === 'ready') {
      const order = get().orders.find((o) => o.id === orderId);
      if (order) {
        get().addAlert({
          type: 'order_ready',
          title: 'Order Ready',
          message: `Order ${order.orderNumber} is ready for serving`,
          severity: 'info',
        });
      }
    }
  },
  
  updateOrderItemStatus: (orderId, itemId, status) => {
    set((state) => {
      const orderIndex = state.orders.findIndex((o) => o.id === orderId);
      if (orderIndex === -1) return state;
      
      const order = state.orders[orderIndex];
      const itemIndex = order.items.findIndex((i) => i.id === itemId);
      if (itemIndex === -1) return state;
      
      const newItems = [...order.items];
      newItems[itemIndex] = { ...newItems[itemIndex], status };
      
      const updatedOrder = { ...order, items: newItems, updatedAt: Date.now() };
      const newOrders = [...state.orders];
      newOrders[orderIndex] = updatedOrder;
      
      logStateChange('update', `orders/${orderId}/items/${itemId}/status`, 'updateOrderItemStatus', order.items[itemIndex].status, status);
      
      return { orders: newOrders };
    });
  },
  
  completeOrder: (orderId, paymentMethod, tip = 0) => {
    set((state) => {
      const orderIndex = state.orders.findIndex((o) => o.id === orderId);
      if (orderIndex === -1) return state;
      
      const order = state.orders[orderIndex];
      const updatedOrder = {
        ...order,
        status: 'completed' as OrderStatus,
        paymentMethod,
        paymentStatus: 'paid' as const,
        tip,
        total: order.subtotal + order.tax + tip,
        updatedAt: Date.now(),
        completedAt: Date.now(),
      };
      
      const newOrders = [...state.orders];
      newOrders[orderIndex] = updatedOrder;
      
      logStateChange('update', `orders/${orderId}`, 'completeOrder', order, updatedOrder);
      
      return { orders: newOrders };
    });
    
    // Update table status
    const order = get().orders.find((o) => o.id === orderId);
    if (order?.tableNumber) {
      const table = get().tables.find((t) => t.number === order.tableNumber);
      if (table) {
        get().updateTableStatus(table.id, 'cleaning');
      }
    }
  },
  
  cancelOrder: (orderId) => {
    set((state) => {
      const orderIndex = state.orders.findIndex((o) => o.id === orderId);
      if (orderIndex === -1) return state;
      
      const order = state.orders[orderIndex];
      const updatedOrder = {
        ...order,
        status: 'cancelled' as OrderStatus,
        updatedAt: Date.now(),
      };
      
      const newOrders = [...state.orders];
      newOrders[orderIndex] = updatedOrder;
      
      logStateChange('update', `orders/${orderId}/status`, 'cancelOrder', order.status, 'cancelled');
      
      return { orders: newOrders };
    });
  },
  
  // Staff Actions
  addStaff: (staffData) => {
    const now = new Date().toISOString();
    const newStaff: Staff = {
      id: (staffData as Staff).id || uuidv4(),
      name: staffData.name,
      email: staffData.email,
      phone: staffData.phone,
      role: staffData.role,
      hourlyRate: staffData.hourlyRate,
      status: staffData.status || 'active',
      assignedTables: staffData.assignedTables || [],
      createdAt: (staffData as Staff).createdAt || now,
      updatedAt: (staffData as Staff).updatedAt || now,
    };
    
    set((state) => {
      logStateChange('set', 'staff/add', 'addStaff', undefined, newStaff);
      return { staff: [...state.staff, newStaff] };
    });
    
    return newStaff;
  },
  
  updateStaff: (id, updates) => {
    set((state) => {
      const index = state.staff.findIndex((s) => s.id === id);
      if (index === -1) return state;
      
      const oldStaff = state.staff[index];
      const updatedStaff = { ...oldStaff, ...updates, updatedAt: new Date().toISOString() };
      const newStaff = [...state.staff];
      newStaff[index] = updatedStaff;
      
      logStateChange('update', `staff/${id}`, 'updateStaff', oldStaff, updatedStaff);
      
      return { staff: newStaff };
    });
  },
  
  deleteStaff: (id) => {
    set((state) => {
      const staff = state.staff.find((s) => s.id === id);
      logStateChange('delete', `staff/${id}`, 'deleteStaff', staff, undefined);
      return { staff: state.staff.filter((s) => s.id !== id) };
    });
  },
  
  // Table Actions
  addTable: (tableData) => {
    const now = new Date().toISOString();
    const newTable: Table = {
      id: (tableData as Table).id || uuidv4(),
      tableNumber: tableData.tableNumber,
      capacity: tableData.capacity,
      status: tableData.status || 'available',
      section: tableData.section,
      minPartySize: tableData.minPartySize || 1,
      maxPartySize: tableData.maxPartySize || tableData.capacity,
      createdAt: (tableData as Table).createdAt || now,
      updatedAt: (tableData as Table).updatedAt || now,
    };
    
    set((state) => {
      logStateChange('set', 'tables/add', 'addTable', undefined, newTable);
      return { tables: [...state.tables, newTable] };
    });
    
    return newTable;
  },

  updateTable: (id, updates) => {
    set((state) => {
      const index = state.tables.findIndex((t) => t.id === id);
      if (index === -1) return state;
      
      const oldTable = state.tables[index];
      const updatedTable = { ...oldTable, ...updates, updatedAt: new Date().toISOString() };
      const newTables = [...state.tables];
      newTables[index] = updatedTable;
      
      logStateChange('update', `tables/${id}`, 'updateTable', oldTable, updatedTable);
      
      return { tables: newTables };
    });
  },

  deleteTable: (id) => {
    set((state) => {
      const table = state.tables.find((t) => t.id === id);
      logStateChange('delete', `tables/${id}`, 'deleteTable', table, undefined);
      return { tables: state.tables.filter((t) => t.id !== id) };
    });
  },
  
  updateTableStatus: (id, status, orderId) => {
    set((state) => {
      const index = state.tables.findIndex((t) => t.id === id);
      if (index === -1) return state;
      
      const oldTable = state.tables[index];
      const updatedTable = { 
        ...oldTable, 
        status, 
        currentOrderId: orderId || (status === 'available' ? undefined : oldTable.currentOrderId) 
      };
      const newTables = [...state.tables];
      newTables[index] = updatedTable;
      
      logStateChange('update', `tables/${id}/status`, 'updateTableStatus', oldTable.status, status);
      
      return { tables: newTables };
    });
  },
  
  // Reservation Actions
  addReservation: (reservationData) => {
    const now = new Date().toISOString();
    const newReservation: Reservation = {
      id: (reservationData as Reservation).id || uuidv4(),
      customerName: reservationData.customerName,
      customerPhone: reservationData.customerPhone,
      customerEmail: reservationData.customerEmail,
      partySize: reservationData.partySize,
      tableId: reservationData.tableId,
      date: reservationData.date,
      time: reservationData.time,
      specialRequests: reservationData.specialRequests,
      status: (reservationData as Reservation).status || 'pending',
      createdAt: (reservationData as Reservation).createdAt || now,
      updatedAt: (reservationData as Reservation).updatedAt || now,
    };
    
    set((state) => {
      logStateChange('set', 'reservations/add', 'addReservation', undefined, newReservation);
      return { reservations: [...state.reservations, newReservation] };
    });
    
    return newReservation;
  },
  
  updateReservation: (id, updates) => {
    set((state) => {
      const index = state.reservations.findIndex((r) => r.id === id);
      if (index === -1) return state;
      
      const oldReservation = state.reservations[index];
      const updatedReservation = { ...oldReservation, ...updates, updatedAt: new Date().toISOString() };
      const newReservations = [...state.reservations];
      newReservations[index] = updatedReservation;
      
      logStateChange('update', `reservations/${id}`, 'updateReservation', oldReservation, updatedReservation);
      
      return { reservations: newReservations };
    });
  },

  deleteReservation: (id) => {
    set((state) => {
      const reservation = state.reservations.find((r) => r.id === id);
      logStateChange('delete', `reservations/${id}`, 'deleteReservation', reservation, undefined);
      return { reservations: state.reservations.filter((r) => r.id !== id) };
    });
  },
  
  cancelReservation: (id) => {
    set((state) => {
      const index = state.reservations.findIndex((r) => r.id === id);
      if (index === -1) return state;
      
      const oldReservation = state.reservations[index];
      const updatedReservation = { ...oldReservation, status: 'cancelled' as const, updatedAt: Date.now() };
      const newReservations = [...state.reservations];
      newReservations[index] = updatedReservation;
      
      logStateChange('update', `reservations/${id}/status`, 'cancelReservation', oldReservation.status, 'cancelled');
      
      return { reservations: newReservations };
    });
  },
  
  // Alert Actions
  addAlert: (alertData) => {
    const newAlert: Alert = {
      ...alertData,
      id: uuidv4(),
      read: false,
      createdAt: Date.now(),
    };
    
    set((state) => ({ alerts: [newAlert, ...state.alerts] }));
  },
  
  markAlertRead: (id) => {
    set((state) => ({
      alerts: state.alerts.map((a) => 
        a.id === id ? { ...a, read: true } : a
      ),
    }));
  },
  
  clearAlerts: () => {
    set({ alerts: [] });
  },
  
  // Utility
  setSelectedItem: (id) => {
    set({ selectedItem: id });
  },
  
  loadSampleData: () => {
    const store = get();
    
    // Sample Menu Items
    store.addMenuItem({
      name: 'Classic Burger',
      description: 'Juicy beef patty with fresh vegetables and special sauce',
      price: 12.99,
      category: 'main_course',
      ingredients: ['beef', 'lettuce', 'tomato', 'onion', 'cheese', 'bun'],
      preparationTime: 15,
      isAvailable: true,
      allergens: ['gluten', 'dairy'],
    });
    
    store.addMenuItem({
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with caesar dressing and croutons',
      price: 8.99,
      category: 'appetizer',
      ingredients: ['romaine', 'parmesan', 'croutons', 'caesar_dressing'],
      preparationTime: 8,
      isAvailable: true,
      allergens: ['gluten', 'dairy'],
    });
    
    store.addMenuItem({
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center',
      price: 7.99,
      category: 'dessert',
      ingredients: ['chocolate', 'flour', 'eggs', 'butter', 'sugar'],
      preparationTime: 12,
      isAvailable: true,
      allergens: ['gluten', 'dairy', 'eggs'],
    });
    
    // Sample Tables
    for (let i = 1; i <= 10; i++) {
      store.addTable({
        number: i,
        capacity: i <= 4 ? 2 : i <= 8 ? 4 : 6,
        status: 'available',
        section: i <= 5 ? 'Main Hall' : 'Patio',
      });
    }
    
    // Sample Ingredients
    store.addIngredient({
      name: 'Beef Patty',
      unit: 'piece',
      quantity: 50,
      minQuantity: 20,
      costPerUnit: 2.50,
    });
    
    store.addIngredient({
      name: 'Romaine Lettuce',
      unit: 'kg',
      quantity: 5,
      minQuantity: 2,
      costPerUnit: 4.00,
    });
    
    store.addIngredient({
      name: 'Chocolate',
      unit: 'kg',
      quantity: 3,
      minQuantity: 1,
      costPerUnit: 15.00,
    });
  },
}));

export default useRestaurantStore;
