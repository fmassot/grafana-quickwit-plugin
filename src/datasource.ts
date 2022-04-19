import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldType,
  MutableDataFrame,
} from '@grafana/data';
import {getBackendSrv} from '@grafana/runtime';

import {defaultQuery, MyDataSourceOptions, MyQuery} from './types';
import defaults from 'lodash/defaults';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);

    this.index = instanceSettings.jsonData.index;
    this.url = instanceSettings.jsonData.url;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map((query) =>
        this.doRequest(query).then((response) => {
          const frame = new MutableDataFrame({
            refId: query.refId,
            fields: [
              {name: 'Time', type: FieldType.time},
              {name: 'Value', type: FieldType.number},
            ],
          });

          console.log('response', response);
          response.data.hits.forEach((point: any) => {
            frame.appendRow([point.timestamp[0], point.tenant_id[0]]);
          });

          return frame;
        })
    );

    return Promise.all(promises).then((data) => ({data}));
  }

  async doRequest(query: MyQuery) {
    query = defaults(query, defaultQuery);
    let data: any = {query: query.query, sort_by_field: query.sort_by_field, max_hits: 1000};
    data = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null));
    if (query.aggregations && query.aggregations != '') {
      data.aggregations = JSON.parse(query.aggregations);
      data.max_hits = 0;
    }
    console.log('query', data);

    const result = await getBackendSrv().datasourceRequest({
      method: 'POST',
      url: `${this.url}/api/v1/${this.index}/search`,
      data: data,
      headers: {'Content-type': 'application/json'},
    });
    return result;
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
