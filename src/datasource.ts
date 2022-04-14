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
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const {range} = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    const data = options.targets.map((target) => {
      const query = defaults(target, defaultQuery);

      const frame = new MutableDataFrame({
        refId: query.refId,
        fields: [
          {name: 'time', type: FieldType.time},
          {name: 'value', type: FieldType.number},
        ],
      });

      // duration of the time range, in milliseconds.
      const duration = to - from;

      // step determines how close in time (ms) the points will be to each other.
      const step = duration / 1000;

      for (let t = 0; t < duration; t += step) {
        frame.add({time: from + t, value: Math.sin((2 * Math.PI * t) / duration)});
      }

      return frame;
    });

    return {data};
  }

  async doRequest(query: MyQuery) {
    const result = await getBackendSrv().datasourceRequest({
      method: 'GET',
      url: 'http://127.0.0.1:7280/api/v1/hdfs-logs/search?query=1',
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
