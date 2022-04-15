import {DataQuery, DataSourceJsonData} from '@grafana/data';

export interface MyQuery extends DataQuery {
  query?: string;
  sortByField: string;
}

export const defaultQuery: Partial<MyQuery> = {
  query: '',
  sortByField: 'timestamp',
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
