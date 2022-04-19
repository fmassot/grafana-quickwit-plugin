import React, {ChangeEvent, PureComponent} from 'react';
import {LegacyForms} from '@grafana/ui';
import {DataSourcePluginOptionsEditorProps} from '@grafana/data';
import {defaultDataSourceOptions, MyDataSourceOptions, MySecureJsonData} from './types';
import defaults from 'lodash/defaults';

const {SecretFormField, FormField} = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {
}

interface State {
}

export class ConfigEditor extends PureComponent<Props, State> {
  onURLChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {onOptionsChange, options} = this.props;
    const jsonData = {
      ...options.jsonData,
      url: event.target.value,
    };
    jsonData.url = jsonData.url.replace(/\/$/, '');
    onOptionsChange({...options, jsonData});
  };

  onIndexChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {onOptionsChange, options} = this.props;
    const jsonData = {
      ...options.jsonData,
      index: event.target.value,
    };
    onOptionsChange({...options, jsonData});
  };

  // Secure field (only sent to the backend)
  onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonData: {
        apiKey: event.target.value,
      },
    });
  };

  onResetAPIKey = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        apiKey: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        apiKey: '',
      },
    });
  };

  render() {
    const {options} = this.props;
    const jsonData = defaults(options.jsonData, defaultDataSourceOptions);
    const secureJsonFields = options.secureJsonFields;
    const secureJsonData = (options.secureJsonData || {}) as MySecureJsonData;

    return (
        <div className="gf-form-group">
          <div className="gf-form">
            <FormField
                label="URL"
                labelWidth={3}
                inputWidth={300}
                onChange={this.onURLChange}
                value={jsonData.url || ''}
            />
          </div>

          <div className="gf-form">
            <FormField
                label="Index"
                labelWidth={6}
                inputWidth={100}
                onChange={this.onIndexChange}
                value={jsonData.index || ''}
            />
          </div>

        <div className="gf-form-inline">
          <div className="gf-form">
            <SecretFormField
              isConfigured={(secureJsonFields && secureJsonFields.apiKey) as boolean}
              value={secureJsonData.apiKey || ''}
              label="API Key"
              placeholder="secure json field (backend only)"
              labelWidth={6}
              inputWidth={20}
              onReset={this.onResetAPIKey}
              onChange={this.onAPIKeyChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
