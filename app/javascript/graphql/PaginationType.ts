export interface PaginationQueryParams {
    first?: number;
    last?: number;
    after?: string;
    before?: string;
}

export interface PageInfo {
    endCursor?: string | null,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    startCursor?: string | null,
}

