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
  onAggregationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {onChange, query, onRunQuery} = this.props;
    onChange({...query, aggregation: event.target.value});
    onRunQuery();
  };

  render() {
    const myQuery = defaults(this.props.query, defaultQuery);
    const {query, sort_by_field: sort_by_field, aggregation} = myQuery;
    const aggregationExample = "Enter a json. Example: {\n" +
        "      \"range_buckets\": {\n" +
        "        \"range\": {\n" +
        "          \"field\": \"ts\",\n" +
        "          \"ranges\": [ { \"to\": 2f64 }, { \"from\": 2f64, \"to\": 5f64 }, { \"from\": 5f64, \"to\": 9f64 }, { \"from\": 9f64 } ]\n" +
        "        },\n" +
        "        \"aggs\": {\n" +
        "          \"average_ts\": {\n" +
        "            \"avg\": { \"field\": \"ts\" }\n" +
        "          }\n" +
        "        }\n" +
        "      }\n" +
        "    }"

    return (
        <div className="gf-form">
          <FormField labelWidth={8} value={query || ''} onChange={this.onQueryChange} label="Query text"/>
          <FormField labelWidth={7} value={sort_by_field || ''} onChange={this.onSortByFieldChange} label="Sort by"/>
          <FormField labelWidth={7} value={aggregation || ''} onChange={this.onAggregationChange} label="Aggregation"
                     tooltip={aggregationExample}/>
        </div>
    );
  }
}
