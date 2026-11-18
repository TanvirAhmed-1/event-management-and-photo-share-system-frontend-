export interface SelectedServiceConfig {
  serviceId: string;
  name: string;
  basePrice: number;
  pricingModel: string;
  quantity: number;
  hours?: number;
  isPhotography?: boolean;
  tier?: "Basic" | "Premium" | "Cinematic";
  includeAiAddon?: boolean;
}

export interface SelectedFoodConfig {
  foodItemId: string;
  name: string;
  pricePerPerson: number;
  categoryName?: string;
}

export interface EventWizardState {
  // Step 1
  city: string;
  area: string;
  eventTypeId: string;
  eventTypeName: string;
  title: string;

  // Step 2
  eventDate: string;
  eventTime: string;
  venue: string;
  guestCount: number;
  selectedServices: SelectedServiceConfig[];
  selectedFoods: SelectedFoodConfig[];
  photographyTier: "Basic" | "Premium" | "Cinematic" | null;
  photographyHours: number;

  // Step 4
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: "BKASH" | "SSLCOMMERZ" | "CASH";
  payAdvance: boolean;
  additionalRequirements: string;
}

