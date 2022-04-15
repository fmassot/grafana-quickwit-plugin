import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldType,
  MutableDataFrame,
} from '@grafana/data';
import {getBackendSrv} from '@grafana/runtime';

import {MyDataSourceOptions, MyQuery} from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);

    this.index = instanceSettings.jsonData.index || 1000.0;
    console.log(instanceSettings)
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

          console.log('toto', response);
          response.data.hits.forEach((point: any) => {
            frame.appendRow([point.timestamp[0], point.tenant_id[0]]);
          });

          return frame;
        })
    );

    return Promise.all(promises).then((data) => ({data}));
  }

  async doRequest(query: MyQuery) {
    const result = await getBackendSrv().datasourceRequest({
      method: 'POST',
      url: `http://127.0.0.1:7280/api/v1/${this.index}/search`,
      data: {query: query.query, sort_by_field: query.sort_by_field, max_hits: 1000},
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
