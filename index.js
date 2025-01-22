require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const historyRouter = require('./routes/history'); // Import history routes
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> console.log("MongoDB Connected"))
.catch((error)=> console.error('Mongo Connection error :', error));
app.use('/api/auth', userRoutes);
app.use('/api/history', historyRouter); 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
