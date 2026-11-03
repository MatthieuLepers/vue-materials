export type Operators = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'ilike' | 'between' | 'notBetween' | 'in' | 'notIn';

export type QueryParamValue = string | number | boolean | Array<string | number | boolean>;

export type FilterValue = [Operators, QueryParamValue];

export type QueryFilters = Record<string, FilterValue>;

export type QueryParams = Record<string, QueryParamValue>;

export function buildFilters(filters: QueryFilters): QueryParams {
  return Object
    .entries(filters)
    .reduce((acc, [key, value]) => ({
      ...acc,
      [`filter.${key}`]: `${value[0]}.${value[1]}`,
    }), {})
  ;
}

export function buildQueryString(queryParams: QueryParams): string {
  return Object
    .entries(queryParams)
    .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(',') : value}`)
    .join('&')
  ;
}
