import { createApp } from './src/server-app.js';

const port = Number(process.env.PORT ?? 5177);
const app = createApp();

app.listen(port, () => {
  console.log(`Civic Copilot demo running at http://localhost:${port}`);
});
