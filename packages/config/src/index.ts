import { z } from 'zod';

// Export all constants and utils
export * from './constants';
export * from './utils';

// Define and export all schemas directly
export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = authSchema.extend({
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const contactFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  propertyId: z.string().optional(),
  message: z.string().optional()
});

export const investmentMatchmakerSchema = z.object({
  goal: z.enum(['HIGH_ROI', 'CAPITAL_GROWTH', 'GOLDEN_VISA'], {
    errorMap: () => ({ message: 'Please select an investment goal' })
  }),
  budget: z.number().min(10000, 'Minimum budget is $10,000'),
  country: z.enum(['georgia', 'cyprus', 'greece', 'lebanon', 'any']).optional(),
});

export const investmentCalculatorSchema = z.object({
  downPaymentPercent: z.number().min(0, 'Down payment must be at least 0%').max(100, 'Down payment cannot exceed 100%'),
  interestRate: z.number().min(0, 'Interest rate must be at least 0%').max(30, 'Interest rate cannot exceed 30%'),
  loanTermYears: z.number().min(1, 'Loan term must be at least 1 year').max(50, 'Loan term cannot exceed 50 years'),
  propertyPrice: z.number().min(0, 'Property price must be positive')
});

export const propertySearchSchema = z.object({
  country: z.enum(['georgia', 'cyprus', 'greece', 'lebanon']).optional(),
  status: z.enum(['OFF_PLAN', 'NEW_BUILD', 'RESALE']).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  investmentGoal: z.enum(['HIGH_ROI', 'CAPITAL_GROWTH', 'GOLDEN_VISA']).optional()
});

export const userProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  country: z.string().optional(),
  investmentGoals: z.array(z.enum(['HIGH_ROI', 'CAPITAL_GROWTH', 'GOLDEN_VISA'])).optional()
});

export const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().min(3, 'Currency must be at least 3 characters'),
  bedrooms: z.number().min(0, 'Bedrooms must be non-negative'),
  bathrooms: z.number().min(0, 'Bathrooms must be non-negative'),
  area: z.number().min(0, 'Area must be positive'),
  country: z.enum(['georgia', 'cyprus', 'greece', 'lebanon']),
  status: z.enum(['OFF_PLAN', 'NEW_BUILD', 'RESALE']),
  developerId: z.string().optional(),
  locationGuideId: z.string().optional()
});

// Export types
export type AuthData = z.infer<typeof authSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type InvestmentMatchmakerData = z.infer<typeof investmentMatchmakerSchema>;
export type InvestmentCalculatorData = z.infer<typeof investmentCalculatorSchema>;
export type PropertySearchData = z.infer<typeof propertySearchSchema>;
export type UserProfileData = z.infer<typeof userProfileSchema>;
export type PropertyData = z.infer<typeof propertySchema>;
