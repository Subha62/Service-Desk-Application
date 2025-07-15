import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';



dotenv.config();         

connectDB();             

const app = express();


app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/tickets',ticketRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});


app.use((req, res) => {
  res.status(404).json({ message: '❌ API route not found' });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
 
