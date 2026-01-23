import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import shopRoutes from './routes/shop.routes.js';
import browseRoutes from './routes/browse.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/shop', shopRoutes);
app.use('/browse', browseRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Shopify Mock API running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
