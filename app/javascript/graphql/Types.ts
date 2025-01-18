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

export interface AutoTransactionType {
    id: string;
    description: string;
    categoryId: string;
    transactionType?: string;
    amount?: number;
    account?: AccountType;
}