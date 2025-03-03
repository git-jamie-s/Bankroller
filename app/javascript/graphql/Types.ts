export interface AccountType {
    id: string;
    accountName: string;
    accountType?: string;
    bankAccountId: string;
    bankId: string;
    creditcardCycleDate?: number;
    balance: number;
    notes?: string;
    created: Date;
};

export interface ImportRuleType {
    id: string;
    description: string;
    categoryId: string;
    transactionType?: string;
    amount?: number;
    account?: AccountType;
};

export interface CategoryType {
    id: string;
    budgetAmount?: number;
    budgetPeriod?: PeriodEnum;
    created: Date;
};

export interface TransactionType {
    id: string;
    account: AccountType;

    amount: number;
    balance: number;

    bankTransactionId: string;
    chequeNumber?: string;
    date: Date;
    description?: string;
    memo?: string;
    transactionType: string;
    notes: string
    categoryId?: string;
    created: Date;
};

export interface TransactionInputType {
    id: string;
    description: string;
    categoryId?: string;
}

export enum PeriodEnum {
    Weekly = "Weekly",
    TwoWeeks = "TwoWeeks",
    Monthly = "Monthly",
    TwiceMonthly = "TwiceMonthly",
    Yearly = "Yearly"
}

export enum WeekendAdjustEnum {
    None = "None",
    Before = "Before",
    After = "After",
    Closest = "Closest"
}

export interface ScheduledTransactionType {
    id: string;
    account: AccountType;
    transactionType: string;
    description: string;

    minAmount: number;
    maxAmount?: number;

    startDate: Date;

    period: PeriodEnum;
    weekendAdjust: string
};