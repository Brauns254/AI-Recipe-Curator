export type Recipe = {
  title: string;
  ingredients: string;
  instructions?: string;
};

export type SubscriptionType = 'none' | 'daily' | 'monthly';

export interface User {
  name: string;
  isLoggedIn: boolean;
  subscription: SubscriptionType;
  subscriptionEndDate?: number;
}
