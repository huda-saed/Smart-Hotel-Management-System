require('dotenv').config(); const express=require('express'); const path=require('path');
if(!process.env.JWT_SECRET){console.error('Set JWT_SECRET in .env');process.exit(1);}
const app=express(); app.use(express.json()); app.use(express.static(path.join(__dirname,'public')));
['auth','rooms','customers','bookings','stay','billing'].forEach(r=>app.use('/api/'+r,require('./routes/'+r)));
app.use('/api',(req,res)=>res.status(404).json({error:'Not found'}));
app.listen(process.env.PORT||3000,()=>console.log('Running on http://localhost:'+(process.env.PORT||3000)));
