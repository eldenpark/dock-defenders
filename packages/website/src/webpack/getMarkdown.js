const fs = require('fs');
const { logger } = require('jege/server');
const path = require('path');
const showdown = require('showdown');

const log = logger('[website]');

const rootPath = process.env.ROOT_PATH;

module.exports = function getMarkdown() {
  let html;
  try {
    const readmePath = path.resolve(rootPath, 'README.md');
    const content = fs.readFileSync(readmePath).toString();

    const converter = new showdown.Converter();
    html = converter.makeHtml(content);
    process.env.ABOUT_HTML = html;
    log('getMarkdown(): process.env.ABOUT_HTML: %s', html);
  } catch (err) {
    log('error getting markdown', err);
  }
  return html;
};
