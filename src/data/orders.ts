import type { Order, CartItem } from '@/lib/types';
import { EGYPTIAN_GOVERNORATES, PAYMENT_METHODS_AR, ORDER_STATUSES_AR } from '@/lib/constants';
import { MOCK_PRODUCTS } from './products'; // For sample items

export let MOCK_ORDERS: Order[] = [
    {
        id: `order_${Date.now() - 500000}_abc12`,
        userId: `cust-${Date.now() - 500000}`,
        customerDetails: {
            name: "محمد أحمد",
            phone: "01012345678",
            address: "123 شارع الهرم، قسم الهرم",
            governorate: "الجيزة",
            email: "mohamed.ahmed@example.com"
        },
        items: [
            { ...MOCK_PRODUCTS[0], quantity: 1 }, // iPhone 15 Pro Case
            { ...MOCK_PRODUCTS[2], quantity: 1 }  // 65W GaN Charger
        ],
        totalAmount: MOCK_PRODUCTS[0].price + MOCK_PRODUCTS[2].price,
        shippingCost: EGYPTIAN_GOVERNORATES.find(g => g.name === "الجيزة")?.shippingCost || 50,
        finalAmount: (MOCK_PRODUCTS[0].price + MOCK_PRODUCTS[2].price) + (EGYPTIAN_GOVERNORATES.find(g => g.name === "الجيزة")?.shippingCost || 50),
        paymentMethod: 'cod',
        status: 'delivered',
        createdAt: new Date(Date.now() - 500000).toISOString(),
    },
    {
        id: `order_${Date.now() - 300000}_def34`,
        userId: `admin-searchemail85@gmail.com`, // An admin user
        customerDetails: {
            name: "فاطمة علي",
            phone: "01198765432",
            address: "45 شارع فؤاد، وسط البلد",
            governorate: "الإسكندرية",
            email: "fatima.ali@example.com"
        },
        items: [
            { ...MOCK_PRODUCTS[1], quantity: 1 } // Wireless Noise Cancelling Earbuds
        ],
        totalAmount: MOCK_PRODUCTS[1].price,
        shippingCost: EGYPTIAN_GOVERNORATES.find(g => g.name === "الإسكندرية")?.shippingCost || 60,
        finalAmount: MOCK_PRODUCTS[1].price + (EGYPTIAN_GOVERNORATES.find(g => g.name === "الإسكندرية")?.shippingCost || 60),
        paymentMethod: 'vodafone_cash',
        status: 'shipping',
        createdAt: new Date(Date.now() - 300000).toISOString(),
    },
    {
        id: `order_${Date.now() - 100000}_ghi56`,
        userId: null, // Guest user
        customerDetails: {
            name: "عميل زائر",
            phone: "01234567890",
            address: "789 كورنيش النيل، المعادي",
            governorate: "القاهرة",
            email: "guest@example.com"
        },
        items: [
            { ...MOCK_PRODUCTS[3], quantity: 2 } // Screen Protector S24 Ultra
        ],
        totalAmount: MOCK_PRODUCTS[3].price * 2,
        shippingCost: EGYPTIAN_GOVERNORATES.find(g => g.name === "القاهرة")?.shippingCost || 50,
        finalAmount: (MOCK_PRODUCTS[3].price*2) + (EGYPTIAN_GOVERNORATES.find(g => g.name === "القاهرة")?.shippingCost || 50),
        paymentMethod: 'fawry',
        status: 'pending',
        createdAt: new Date(Date.now() - 100000).toISOString(),
    }
];

// Function to add an order
export function addMockOrder(
  userId: string | null,
  customerDetails: Order['customerDetails'],
  items: CartItem[],
  paymentMethod: Order['paymentMethod']
): Order {
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const governorateInfo = EGYPTIAN_GOVERNORATES.find(g => g.name === customerDetails.governorate);
  const shippingCost = governorateInfo ? governorateInfo.shippingCost : 70; // Default shipping cost if not found
  const finalAmount = totalAmount + shippingCost;

  const newOrder: Order = {
    id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    customerDetails,
    items,
    totalAmount,
    shippingCost,
    finalAmount,
    paymentMethod,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  MOCK_ORDERS.unshift(newOrder);
  return newOrder;
}

// Function to get all orders
export function getMockOrders(): Order[] {
  return [...MOCK_ORDERS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Function to get an order by ID
export function getMockOrderById(orderId: string): Order | undefined {
  return MOCK_ORDERS.find(order => order.id === orderId);
}

// Function to update order status
export function updateMockOrderStatus(orderId: string, status: Order['status']): Order | undefined {
  const orderIndex = MOCK_ORDERS.findIndex(order => order.id === orderId);
  if (orderIndex > -1) {
    MOCK_ORDERS[orderIndex].status = status;
    return MOCK_ORDERS[orderIndex];
  }
  return undefined;
}
