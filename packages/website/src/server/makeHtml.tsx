import {
  createAssetElements,
} from 'express-isomorphic/utils';
import { dom } from '@fortawesome/fontawesome-svg-core';
import { logger } from 'jege/server';
import { MakeHtml } from 'express-isomorphic';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

import IsomorphicState from './IsomorphicState';
import ServerApp from '@@src/server/ServerApp';

const log = logger('[website]');

const isProd = process.env.NODE_ENV === 'production';

const makeHtml: MakeHtml<IsomorphicState> = async ({
  host,
  protocol,
  serverState,
  url,
}) => {
  log('makeHtml(): protocol: %s, host: %s, url: %s', protocol, host, url);

  const { socketPath, socketPort, state } = serverState;
  const {
    assets,
    publicPath,
  } = state;
  const serverStyleSheet = new ServerStyleSheet();

  const reactAssetElements = createAssetElements(assets, publicPath);
  const {
    builtAt,
  } = serverState.state;
  const isomorphicData = {
    builtAt,
  };
  const staticContext = {};

  const element = (
    <ServerApp
      isomorphicData={isomorphicData}
      requestUrl={url}
      serverStyleSheet={serverStyleSheet}
      staticContext={staticContext}
    />
  );

  const reactAppInString = await renderToString(element);
  const styleTags = serverStyleSheet.getStyleTags();

  const html = template({
    fontAwesomeCss: dom.css(),
    isomorphicData,
    reactAppInString,
    reactAssetElements,
    socketPath,
    socketPort,
    styledComponentsStyleElements: styleTags,
  })
    .replace(/[\r\n]+/gm, '');

  return html;
};

function template({
  fontAwesomeCss,
  isomorphicData,
  reactAppInString,
  reactAssetElements,
  socketPath,
  socketPort,
  styledComponentsStyleElements,
}) {
  return `
<html>
  <head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-161485149-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-161485149-1');
    </script>
    <link rel="icon" type="image/x-icon" href="/g/favicon.ico">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
    <style>${fontAwesomeCss}</style>
    ${styledComponentsStyleElements}
    <script>window['ISOMORPHIC_DATA']=${JSON.stringify(isomorphicData)}</script>
    <title>Dock Defenders</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
  </head>
  <body>
    <div id="app-root">${reactAppInString}</div>
    ${reactAssetElements}
    ${socket(socketPort, socketPath)}
  </body>
</html>
`;
}

function socket(socketPort, socketPath) {
  return isProd
    ? ''
    : `
      <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.dev.js"></script>
      <script>
        if (window.io) {
          var socket = io('http://localhost:${socketPort}', {
            path: '${socketPath}'
          });
          socket.on('express-isomorphic', function ({ msg }) {
            console.warn('[express-isomorphic] %s', msg);
          });
        }
      </script>
    `;
}

export default makeHtml;
