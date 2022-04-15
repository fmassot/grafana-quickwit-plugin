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
        const {onChange, query} = this.props;
        onChange({...query, query: event.target.value});
    };
    onSortByFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {onChange, query} = this.props;
        onChange({...query, query: event.target.value});
    };


    render() {
        const query = defaults(this.props.query, defaultQuery);
        const {queryText, sortByField} = query;

        return (
            <div className="gf-form">
                <FormField
                    labelWidth={8}
                    value={queryText || ''}
                    onChange={this.onQueryChange}
                />
                <FormField
                    labelWidth={7}
                    value={sortByField || ''}
                    onChange={this.onSortByFieldChange}
                    label="Sort by"
                />
            </div>
    );
  }
}
