import express from 'express';
import { render }from './server-entry.js';
import fs from 'fs';
const server = express();

server.get('/', async (req, res) => {
  const appHTML = await render();
  const template = fs.readFileSync('./index.html', 'utf-8');
  res.send(template.replace('<!--ssr-outlet-->', appHTML));
  }
);

server.use(express.static('.'));

server.listen(3000, () => {
  console.log('Your SSR server running at: http://localhost:3000');
});
