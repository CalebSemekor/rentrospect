export interface EscrowPayment {
    endDate: Date
    amount: number
    userId: string
    assetId: string
    startDate: Date
    consultationMode: number
}

export interface VerifyPayment {
    asset: string
    amount: number
    renter: string
    azaFee: number
    netAmount: number
    vendorEmail: string
    transactionId: string
    rentrospectFee: number
    securityDeposit: number
}

export interface VendorPaymentSessionRes {
  success: boolean;
  data: Data;
  error?: Error;
}

interface Data {
  id: string;
  recipient: string;
  recipientUserId: string;
  amount: number;
  currency: string;
  note: string;
  reference: string;
  status: string;
  failureReason: string;
}

interface Error {
  code: string;
  message: string;
  field: string;
}

interface InitiateVendorPayment {
  note: string;
  amount: number; // decimal.Decimal in Go
  reference: string;
  recipient: string; // email
  idempotencyKey: string;
}