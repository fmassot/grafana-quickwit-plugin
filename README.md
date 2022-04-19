# Grafana Data Source Quickwit Plugin

## What is Grafana Data Source Plugin?

Grafana supports a wide range of data sources, including Prometheus, MySQL, and even Datadog. Here's a plugin to use
Quickwit as datasource. This is only a proof of concept. This plugin allows you to display simple timeserie queries on a
Grafana panel.

## Getting started

1. Build this plugin.
   - Install dependancies
     ```bash
     yarn install
     ```
   - Build plugin in watch mode to be able to see console logs.
     ```bash
     yarn watch
     ```
   - Or build it for production.
     ```bash
     yarn build
     ```
2. Install Grafana and configure it to enable the plugin

   - [Install Grafana](https://grafana.com/docs/grafana/latest/installation/)
   - Edit grafana.ini (usually /etc/grafana/grafana.ini) and enable the development app_mode. Otherwise, unsigned
     plugins will not be enabled.
     ```bash
     app_mode = development
     ```
   - Also provide a path to this plugin directory.
     ```bash
     plugins = /path/to/this/repository
     ```
   - Restart Grafana so it will load the plugin.
     ```bash
     sudo systemctl restart grafana-server;
     ```
   - Check if everything went right. This line should
     appear: `msg="Plugin registered" pluginId=quickwit-plugin-datasource `.
     ```bash
     journalctl -f -u grafana-server
     ```

3. Configure Grafana in the browser
    - Since this plugin is a [simple datasource plugin](https://grafana.com/tutorials/build-a-data-source-plugin/),
      not a [backend datasource plugin](https://grafana.com/tutorials/build-a-data-source-backend-plugin/), request are
      made by the browser.
      It leads to CORS errors. To be able to try this plugin, please disable these specific checks on your browser.
      Run this command to launch a session with CORS check disabled:
      ```bash
      google-chrome --disable-web-security --user-data-dir=~/.config/google-chrome/Default/
      ```
    - Browse Grafana `http://localhost:3000/`
    - Go to `Configuration` -> `Data sources` -> `Add data source` -> Look for `quickwit-plugin`.
    - Here you can specify the URL of the Quickwit source and the index you want to use.
    - Now, you can finally create a panel using Quickwit as data source: Click `+` on the left sidebar -> `Create`
      -> `Add a new panel`

# Conclusions

Remaking a plugin from scratch seems complicated.

It would be necessary to add a backend part in Go in order to realize the queries on the server side rather than on the
browser side and avoid CORS errors.
It would also be necessary to add a part which can include the mapping of an Index in order to propose dynamically the
attributes on which to filter/sort/group by.
It would be necessary to code the treatment of the answers and the mapping of the values according to the type of
answer: query or aggregation etc.

All this is already done by
the [Elasticsearch plugin](https://github.com/grafana/grafana/tree/main/public/app/plugins/datasource/elasticsearch).
However, you can't just copy and paste it. It can be found in the official Grafana repo which has a very different
architecture than a custom plugin. For example, the Go backend is missing and there are many dependencies with other
parts of the Grafana code that we don't want to copy and paste.

One solution would be to adapt the Quickwit endpoints to match those from Elasticsearch. Knowing that the answers are
already formatted like those of ES, we only need to adapt our endpoints to make the ES plugin compatible with Quickwit.

Here are the important parts of
the [Elasticsearch plugin code](https://github.com/grafana/grafana/tree/main/public/app/plugins/datasource/elasticsearch):

- [The main search function is `query()` in `database.ts`](https://github.com/grafana/grafana/blob/main/public/app/plugins/datasource/elasticsearch/datasource.ts#L624)
- [The search is done using the `/_msearch` endpoint](https://github.com/grafana/grafana/blob/main/public/app/plugins/datasource/elasticsearch/datasource.ts#L832-L844)
- [The Query structure](https://github.com/grafana/grafana/blob/main/public/app/plugins/datasource/elasticsearch/types.ts#L67)
- [The mapping of the attributes](https://github.com/grafana/grafana/blob/main/public/app/plugins/datasource/elasticsearch/datasource.ts#L716-L730)
  returned by the index in order to offer them in the Query editor is done. There's a call to the
  endpoint `/index/_mapping` which is missing in Quickwit.
- [The management of the query editor in case of aggregation](https://github.com/grafana/grafana/tree/main/public/app/plugins/datasource/elasticsearch/components/QueryEditor/BucketAggregationsEditor)
- [The processing of the response during an aggregation](https://github.com/grafana/grafana/blob/main/public/app/plugins/datasource/elasticsearch/elastic_response.ts#L567-L595)

## Learn more

- [Build a data source plugin tutorial](https://grafana.com/tutorials/build-a-data-source-plugin) which I used to create
  this poc
- [Build a backend data source plugin tutorial](https://grafana.com/tutorials/build-a-data-source-backend-plugin/) which
  requires some Go knowledge to create the backend part
- [Grafana documentation](https://grafana.com/docs/)
- [About the pre-bucketed data for histograms](https://grafana.com/docs/grafana/latest/basics/intro-histograms/#pre-bucketed-data)
