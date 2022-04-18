# Grafana Data Source Quickwit Plugin

## What is Grafana Data Source Plugin?

Grafana supports a wide range of data sources, including Prometheus, MySQL, and even Datadog. Here's a plugin to use
Quickwit as datasource.

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

## TODO

## Learn more

- [Build a data source plugin tutorial](https://grafana.com/tutorials/build-a-data-source-plugin)
- [Grafana documentation](https://grafana.com/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/) - Grafana Tutorials are step-by-step guides that help you make the
  most of Grafana
- [Grafana UI Library](https://developers.grafana.com/ui) - UI components to help you build interfaces using Grafana
  Design System

sudo systemctl edit grafana
[Service]
ProtectHome=false

also grafana.ini:
app_mode = development
plugins = /home/jules/projects/rust/quickwit-grafana-plugin/
