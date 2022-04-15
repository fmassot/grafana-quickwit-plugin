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
  }

  //
  // async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
  //   const {range} = options;
  //   const from = range!.from.valueOf();
  //   const to = range!.to.valueOf();
  //
  //   const data = options.targets.map((target) => {
  //     const query = defaults(target, defaultQuery);
  //
  //     const frame = new MutableDataFrame({
  //       refId: query.refId,
  //       fields: [
  //         {name: 'time', type: FieldType.time},
  //         {name: 'value', type: FieldType.number},
  //       ],
  //     });
  //
  //     // duration of the time range, in milliseconds.
  //     const duration = to - from;
  //
  //     // step determines how close in time (ms) the points will be to each other.
  //     const step = duration / 1000;
  //
  //     for (let t = 0; t < duration; t += step) {
  //       frame.add({time: from + t, value: Math.sin((2 * Math.PI * t) / duration)});
  //     }
  //
  //     return frame;
  //   });
  //
  //   return {data};
  // }
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
            console.log('hihi', point.timestamp[0], point.tenant_id[0]);
            frame.appendRow([point.timestamp[0], point.tenant_id[0]]);
          });

          return frame;
        })
    );

    return Promise.all(promises).then((data) => ({data}));
  }

  async doRequest(query: MyQuery) {
    console.log(query)
    const result = await getBackendSrv().datasourceRequest({
      method: 'GET',
      url: `http://127.0.0.1:7280/api/v1/${this.index}/search`,
      params: {'query': query.query, 'sortByField': query.sortByField},
      headers: {'Access-Control-Allow-Origin': '*', 'Referrer-Policy': 'no-referrer'},
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
