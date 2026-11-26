const r=require('express').Router(),db=require('../config/db'),{auth,wrap,bad}=require('../middleware/auth');
const R=['manager','receptionist'];
r.post('/checkin/:id',auth(...R),wrap(async(q,s)=>{
 const [[b]]=await db.query('SELECT b.*,r.status rs FROM bookings b JOIN rooms r ON r.id=b.room_id WHERE b.id=?',[q.params.id]);
 if(!b) throw bad('Booking not found',404); if(b.status!=='Confirmed') throw bad('Booking is '+b.status,409);
 if(['Occupied','Maintenance','Cleaning'].includes(b.rs)) throw bad('Room not ready ('+b.rs+')',409);
 await db.query("UPDATE bookings SET status='CheckedIn' WHERE id=?",[b.id]); await db.query("UPDATE rooms SET status='Occupied' WHERE id=?",[b.room_id]);
 await db.query('INSERT INTO check_ins(booking_id,staff_id) VALUES(?,?)',[b.id,q.user.id]); s.json({ok:1}); }));
r.post('/checkout/:id',auth(...R),wrap(async(q,s)=>{
 const [[b]]=await db.query('SELECT b.*,i.paid FROM bookings b JOIN invoices i ON i.booking_id=b.id WHERE b.id=?',[q.params.id]);
 if(!b) throw bad('Booking not found',404); if(b.status!=='CheckedIn') throw bad('Guest is not checked in',409);
 const bal=b.total_price-b.paid; if(bal>0) throw bad('Outstanding balance: '+bal.toFixed(2),409);
 await db.query("UPDATE bookings SET status='CheckedOut' WHERE id=?",[b.id]); await db.query("UPDATE rooms SET status='Cleaning' WHERE id=?",[b.room_id]);
 await db.query('INSERT INTO check_outs(booking_id,staff_id) VALUES(?,?)',[b.id,q.user.id]); s.json({ok:1}); }));
module.exports=r;
