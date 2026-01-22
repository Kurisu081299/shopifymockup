// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('API is running');
// });

// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });

import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// IMPORTANT: return JSON, not plain text
app.get('/', (req, res) => {
  console.log('GET / hit');
  res.json({ message: 'API is running' });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3000');
});
