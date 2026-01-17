/**
 * Restaurant Domain Types
 * These represent the entities in our Restaurant Management simulation
 */

// Menu Item - Core entity for restaurant menu
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  ingredients?: string[];
  preparationTime: number; // minutes
  isAvailable: boolean;
  imageUrl?: string;
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  nutritionalInfo?: NutritionalInfo;
  createdAt: string;
  updatedAt: string;
}

export type MenuCategory = 
  | 'appetizer'
  | 'main'
  | 'dessert'
  | 'beverage'
  | 'side'
  | 'special';

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Ingredient - Inventory item
export interface Ingredient {
  id: string;
  name: string;
  unit: IngredientUnit;
  quantity: number;
  minQuantity: number; // Reorder threshold
  costPerUnit: number;
  supplierId?: string;
  expiryDate?: number;
  createdAt: number;
  updatedAt: number;
}

export type IngredientUnit = 'kg' | 'g' | 'l' | 'ml' | 'piece' | 'dozen';

// Supplier
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  paymentTerms: string;
  rating: number; // 1-5
  createdAt: number;
  updatedAt: number;
}

// Order
export interface Order {
  id: string;
  orderNumber: string;
  tableNumber?: number;
  customerName?: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  tip?: number;
  total: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
  status: OrderItemStatus;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'completed'
  | 'cancelled';

export type OrderItemStatus = 
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'served';

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'other';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

// Staff Member
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  hourlyRate: number;
  hireDate: number;
  status: 'active' | 'inactive';
  schedule?: WeeklySchedule;
  createdAt: number;
  updatedAt: number;
}

export type StaffRole = 
  | 'owner'
  | 'manager'
  | 'chef'
  | 'cook'
  | 'waiter'
  | 'cashier'
  | 'host';

export interface WeeklySchedule {
  monday?: Shift[];
  tuesday?: Shift[];
  wednesday?: Shift[];
  thursday?: Shift[];
  friday?: Shift[];
  saturday?: Shift[];
  sunday?: Shift[];
}

export interface Shift {
  startTime: string; // HH:MM
  endTime: string;
}

// Table
export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  section: string;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

// Reservation
export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  partySize: number;
  tableId?: string;
  date: number;
  time: string;
  duration: number; // minutes
  status: ReservationStatus;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export type ReservationStatus = 
  | 'pending'
  | 'confirmed'
  | 'seated'
  | 'completed'
  | 'cancelled'
  | 'no_show';

// Customer (for loyalty/tracking)
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  preferences?: string[];
  allergies?: string[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

// Financial Records
export interface DailySummary {
  id: string;
  date: number;
  totalOrders: number;
  totalRevenue: number;
  totalTips: number;
  totalExpenses: number;
  netProfit: number;
  topSellingItems: { menuItemId: string; quantity: number }[];
  averageOrderValue: number;
  peakHour: number;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: number;
  vendorName?: string;
  receiptUrl?: string;
  approvedBy?: string;
  createdAt: number;
}

export type ExpenseCategory = 
  | 'ingredients'
  | 'utilities'
  | 'rent'
  | 'salaries'
  | 'maintenance'
  | 'marketing'
  | 'equipment'
  | 'other';

// Purchase Order (for restocking)
export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  status: PurchaseOrderStatus;
  totalAmount: number;
  expectedDelivery?: number;
  receivedAt?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface PurchaseOrderItem {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: IngredientUnit;
  unitPrice: number;
  totalPrice: number;
}

export type PurchaseOrderStatus = 
  | 'draft'
  | 'submitted'
  | 'confirmed'
  | 'shipped'
  | 'received'
  | 'cancelled';

// Notification/Alert
export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  read: boolean;
  actionUrl?: string;
  createdAt: number;
}

export type AlertType = 
  | 'low_stock'
  | 'order_ready'
  | 'reservation_upcoming'
  | 'staff_late'
  | 'daily_report'
  | 'system';
