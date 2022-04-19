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

## Learn more

- [Build a data source plugin tutorial](https://grafana.com/tutorials/build-a-data-source-plugin)
- [Grafana documentation](https://grafana.com/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/) - Grafana Tutorials are step-by-step guides that help you make the
  most of Grafana
- [Grafana UI Library](https://developers.grafana.com/ui) - UI components to help you build interfaces using Grafana
  Design System

