import { config } from "@/config";
import { Request } from "express";

export interface PaginationParams {
    page: number;
    pageSize: number;
    skip: number;
}

export interface QueryBuilderResult {
    where: any;
    orderBy: any;
    skip: number;
    take: number;
    select?: any;
    pagination: PaginationParams;
};

export class QueryBuilder {
    protected where: any = {};
    protected orderBy: any = { createdAt: 'desc' };
    protected page: number = 1;
    protected pageSize: number = parseInt(config.DEFAULT_RESPONSE_LIMIT, 10);
    protected select: any = {};

    constructor(
        protected query: any,
        defaultPageSize?: string,
        protected user?: Request['user']
    ) { 
        this.pageSize = parseInt(query.pageSize || defaultPageSize, 10);
        this.page = parseInt(query.page || '1', 10);
    };

    addPagination() {
        this.pageSize = parseInt(this.query.pageSize || this.pageSize, 10);
        this.page = parseInt(this.query.page || '1', 10);
        return this;
    };
    build(): QueryBuilderResult {
        const skip = (this.page - 1) * this.pageSize;

        return {
            where: this.where,
            orderBy: this.orderBy,
            skip,
            take: this.pageSize,
            select: Object.keys(this.select).length > 0 ? this.select : null,
            pagination: {
                page: this.page,
                pageSize: this.pageSize,
                skip
            }
        }
    };

    protected addOrClause(condition: any[]) {
        const filtered = condition.filter(Boolean);

        if (filtered.length > 0) {
            this.where.OR = filtered;
        };

        return this;
    };

    protected setOrderBy(orderBy: any) {
        this.orderBy = orderBy;
        return this;
    };

    protected addWhereCondition(key: string, value: any) {
        this.where[key] = value;
        return this;
    }
}