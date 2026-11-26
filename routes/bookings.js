const r=require('express').Router(),db=require('../config/db'),{auth,wrap,bad}=require('../middleware/auth');
const R=['manager','receptionist'];
r.get('/',auth(...R,'accountant'),wrap(async(q,s)=>{
 let sql=`SELECT b.*,c.full_name customer,r.room_number,i.id invoice_id,i.paid,(b.total_price-i.paid) balance FROM bookings b JOIN customers c ON c.id=b.customer_id
 JOIN rooms r ON r.id=b.room_id LEFT JOIN invoices i ON i.booking_id=b.id WHERE 1`,p=[];
 if(q.query.status){sql+=' AND b.status=?';p.push(q.query.status);}
 if(q.query.q){sql+=' AND (c.full_name LIKE ? OR r.room_number LIKE ? OR b.id=?)';p.push('%'+q.query.q+'%','%'+q.query.q+'%',+q.query.q||0);}
 const [x]=await db.query(sql+' ORDER BY b.id DESC LIMIT 200',p); s.json(x); }));
r.post('/',auth(...R),wrap(async(q,s)=>{
 const {customer_id,room_id,check_in,check_out,guests}=q.body;
 if(!customer_id||!room_id||!check_in||!check_out||check_out<=check_in) throw bad('Customer, room and valid dates required');
 const c=await db.getConnection();
 try{ await c.beginTransaction();
  const [[room]]=await c.query('SELECT * FROM rooms WHERE id=? FOR UPDATE',[room_id]); if(!room) throw bad('Room not found',404);
  if(room.status==='Maintenance') throw bad('Room under maintenance');
  const [[o]]=await c.query("SELECT COUNT(*) n FROM bookings WHERE room_id=? AND status IN('Confirmed','CheckedIn') AND check_in<? AND check_out>?",[room_id,check_out,check_in]);
  if(o.n) throw bad('Room is already booked for these dates',409);
  const nights=Math.round((new Date(check_out)-new Date(check_in))/864e5), total=nights*room.price;
  const [b]=await c.query('INSERT INTO bookings(customer_id,room_id,check_in,check_out,guests,total_price,created_by) VALUES(?,?,?,?,?,?,?)',[customer_id,room_id,check_in,check_out,guests||1,total,q.user.id]);
  await c.query('INSERT INTO invoices(booking_id,total) VALUES(?,?)',[b.insertId,total]);
  await c.commit(); s.json({id:b.insertId,total});
 }catch(e){await c.rollback(); throw e;}finally{c.release();}
}));
r.put('/:id/cancel',auth(...R),wrap(async(q,s)=>{
 const [x]=await db.query("UPDATE bookings SET status='Cancelled' WHERE id=? AND status='Confirmed'",[q.params.id]);
 if(!x.affectedRows) throw bad('Only confirmed bookings can be cancelled',409); s.json({ok:1}); }));
module.exports=r;
