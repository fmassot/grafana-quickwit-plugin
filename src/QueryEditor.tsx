import defaults from 'lodash/defaults';

import React, {ChangeEvent, PureComponent} from 'react';
import {LegacyForms} from '@grafana/ui';
import {QueryEditorProps} from '@grafana/data';
import {DataSource} from './datasource';
import {defaultQuery, MyDataSourceOptions, MyQuery} from './types';

const {FormField} = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {onChange, query, onRunQuery} = this.props;
    onChange({...query, query: event.target.value});
    onRunQuery();
  };
  onSortByFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {onChange, query, onRunQuery} = this.props;
    onChange({...query, sort_by_field: event.target.value});
    onRunQuery();
  };
  onAggregationsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {onChange, query, onRunQuery} = this.props;
    onChange({...query, aggregations: event.target.value});
    onRunQuery();
  };

  render() {
    const myQuery = defaults(this.props.query, defaultQuery);
    const {query, sort_by_field: sort_by_field, aggregations: aggregations} = myQuery;
    const aggregationExample =
        'Enter a json. Example:{\n' +
        '    "timestamp_blocks": {\n' +
        '      "range": {\n' +
        '        "field": "timestamp",\n' +
        '        "ranges": [\n' +
        '          {\n' +
        '            "to": 1500059649\n' +
        '          },\n' +
        '          {\n' +
        '            "from": 1500059649,\n' +
        '            "to": 1501159649\n' +
        '          },\n' +
        '          {\n' +
        '            "from": 1501159649\n' +
        '          }\n' +
        '        ]\n' +
        '      },\n' +
        '      "aggs": {\n' +
        '        "average_in_range": {\n' +
        '          "avg": {\n' +
        '            "field": "timestamp"\n' +
        '          }\n' +
        '        }\n' +
        '      }\n';

    return (
        <div className="gf-form">
          <FormField labelWidth={8} value={query || ''} onChange={this.onQueryChange} label="Query text"/>
          <FormField labelWidth={7} value={sort_by_field || ''} onChange={this.onSortByFieldChange} label="Sort by"/>
          <FormField
              labelWidth={7}
              value={aggregations || ''}
              onChange={this.onAggregationsChange}
              label="Aggregations"
              tooltip={aggregationExample}
          />
        </div>
    );
  }
}
