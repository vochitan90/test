import { APP_CONFIG } from 'app/app.config';

export class NewLoadConfig {
    offset: number = 0;
    limit: number = APP_CONFIG.LIMIT_QUERY;
    filters: FilterField[] = [];
    sortDir: string = ESortDirection[ESortDirection.DESC];
    sortField: string;
}

export class LoadConfig {
    offset: number = 0;
    limit: number = APP_CONFIG.LIMIT_QUERY;
    filters: FilterField[] = [];
    sorts: SortField[] = [];
}

export class FilterField {
    field: string;
    value: string;
    comparison: string;
    type: string;

    constructor(field: string, value: string) {
        this.field = field;
        this.value = value;
        this.type = 'string';
        this.comparison = 'like';
    }
}

export enum ESortDirection { ASC = 'ASC', DESC = 'DESC' }

export class SortField {
    field: string;
    direction: string;

    constructor(field: string, direction: string) {
        this.field = field;
        this.direction = ESortDirection.ASC;
        if (direction !== undefined && direction !== null && ESortDirection.DESC === direction.toLocaleUpperCase().trim()) {
            this.direction = ESortDirection.DESC;
        }
    }
}
