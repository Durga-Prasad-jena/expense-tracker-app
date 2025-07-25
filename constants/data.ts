import { CategoryType, ExpenseCategoryType, SelectModal } from "@/types";

export const expenseCategories : ExpenseCategoryType= {
  groceries: {
    label: "Groceries",
    value: "groceries",
    icon: require("../assets/images/grocery-cart.png"),
    bgColor: "#4B5563", // Deep Teal Green
  },
  rent: {
    label: "Rent",
    value: "rent",
     icon: require("../assets/images/save-money.png"),
    bgColor: "#075985", // Dark Blue
  },
  utilities: {
    label: "Utilities",
    value: "utilities",
     icon: require("../assets/images/utilization.png"),
    bgColor: "#ca8a04", // Dark Golden Brown
  },
  transportation: {
    label: "Transportation",
    value: "transportation",
    icon: require("../assets/images/transportation.png"),
    bgColor: "#b45309", // Dark Orange-Red
  },
  entertainment: {
    label: "Entertainment",
    value: "entertainment",
    icon: require("../assets/images/grocery-cart.png"),
    bgColor: "#0f766e", // Darker Red-Brown
  },
  dining: {
    label: "Dining",
    value: "dining",
   icon: require("../assets/images/dining-table.png"),
    bgColor: "#be185d", // Dark Red
  },
  health: {
    label: "Health",
    value: "health",
    icon: require("../assets/images/healthcare.png"),
    bgColor: "#e11d48", // Dark Purple
  },
  insurance: {
    label: "Insurance",
    value: "insurance",
     icon: require("../assets/images/insurance.png"),
    bgColor: "#404040", // Dark Gray
  },
  savings: {
    label: "Savings",
    value: "savings",
     icon: require("../assets/images/save-money.png"),
    bgColor: "#065F46", // Deep Teal Green
  },
  clothing: {
    label: "Clothing",
    value: "clothing",
   icon: require("../assets/images/grocery-cart.png"),
    bgColor: "#7c3aed", // Dark Indigo
  },
  personal: {
    label: "Personal",
    value: "personal",
     icon: require("../assets/images/grocery-cart.png"),
    bgColor: "#a21caf", // Deep Pink
  },
  others: {
    label: "Others",
    value: "others",
     icon: require("../assets/images/grocery-cart.png"),
    bgColor: "#525252", // Neutral Dark Gray
  },
};

export const incomeCategory:CategoryType = {
  label: "Income",
  value: "income",
   icon: require("../assets/images/grocery-cart.png"),
  bgColor: "#16a34a", // Dark
};

export const transactionTypes:SelectModal = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
];
