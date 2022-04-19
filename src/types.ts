import {DataQuery, DataSourceJsonData} from '@grafana/data';

export interface MyQuery extends DataQuery {
  query?: string;
  sort_by_field: string;
  aggregations?: any;
}

export const defaultQuery: Partial<MyQuery> = {
  query: '*',
  sort_by_field: 'timestamp',
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  url: string;
  index: string;
}

export const defaultDataSourceOptions: Partial<MyDataSourceOptions> = {
  url: 'http://127.0.0.1:7280',
  index: 'hdfs-logs',
};

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}
