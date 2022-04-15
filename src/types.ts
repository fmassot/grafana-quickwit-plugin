import {DataQuery, DataSourceJsonData} from '@grafana/data';

export interface MyQuery extends DataQuery {
  query?: string;
  sort_by_field: string;
  aggregation?: any;
}

export const defaultQuery: Partial<MyQuery> = {
  query: '',
  sort_by_field: 'timestamp',
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  index: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}
