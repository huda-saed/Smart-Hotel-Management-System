const r=require('express').Router(),db=require('../config/db'),{auth,wrap,bad}=require('../middleware/auth');
const F=['manager','accountant','receptionist'];
r.get('/invoice/:bookingId',auth(...F),wrap(async(q,s)=>{
 const [[i]]=await db.query(`SELECT i.*,(i.total-i.paid) balance,c.full_name customer,r.room_number,b.check_in,b.check_out FROM invoices i JOIN bookings b ON b.id=i.booking_id
 JOIN customers c ON c.id=b.customer_id JOIN rooms r ON r.id=b.room_id WHERE i.booking_id=?`,[q.params.bookingId]); if(!i) throw bad('Not found',404);
 const [p]=await db.query('SELECT p.*,u.full_name staff FROM payments p LEFT JOIN users u ON u.id=p.received_by WHERE invoice_id=? ORDER BY p.id',[i.id]); s.json({...i,payments:p}); }));
r.post('/pay',auth(...F),wrap(async(q,s)=>{
 const {invoice_id,amount,method,reference}=q.body; const a=+amount;
 if(!(a>0)||!['Cash','Card'].includes(method)) throw bad('Positive amount and Cash/Card method required');
 const c=await db.getConnection();
 try{ await c.beginTransaction(); const [[i]]=await c.query('SELECT * FROM invoices WHERE id=? FOR UPDATE',[invoice_id]); if(!i) throw bad('Invoice not found',404);
  if(a>i.total-i.paid+1e-9) throw bad('Amount exceeds balance of '+(i.total-i.paid).toFixed(2));
  await c.query('INSERT INTO payments(invoice_id,amount,method,reference,received_by) VALUES(?,?,?,?,?)',[i.id,a,method,reference||null,q.user.id]);
  await c.query('UPDATE invoices SET paid=paid+? WHERE id=?',[a,i.id]); await c.commit(); s.json({ok:1});
 }catch(e){await c.rollback();throw e;}finally{c.release();} }));
r.get('/payments',auth('manager','accountant'),wrap(async(q,s)=>{
 const [x]=await db.query('SELECT p.*,i.booking_id,c.full_name customer FROM payments p JOIN invoices i ON i.id=p.invoice_id JOIN bookings b ON b.id=i.booking_id JOIN customers c ON c.id=b.customer_id ORDER BY p.id DESC LIMIT 200'); s.json(x); }));
r.get('/dashboard',auth(),wrap(async(q,s)=>{
 const one=async(sql)=>Object.values((await db.query(sql))[0][0])[0];
 s.json({rooms:await one('SELECT COUNT(*) FROM rooms'),available:await one("SELECT COUNT(*) FROM rooms WHERE status='Available'"),occupied:await one("SELECT COUNT(*) FROM rooms WHERE status='Occupied'"),
  reserved:await one("SELECT COUNT(*) FROM rooms WHERE status='Reserved'"),customers:await one('SELECT COUNT(*) FROM customers'),
  checkins_today:await one("SELECT COUNT(*) FROM bookings WHERE check_in=CURDATE() AND status IN('Confirmed','CheckedIn')"),
  checkouts_today:await one("SELECT COUNT(*) FROM bookings WHERE check_out=CURDATE() AND status IN('CheckedIn','CheckedOut')"),
  revenue_total:await one('SELECT COALESCE(SUM(amount),0) FROM payments'),revenue_today:await one('SELECT COALESCE(SUM(amount),0) FROM payments WHERE DATE(paid_at)=CURDATE()'),
  revenue_month:await one('SELECT COALESCE(SUM(amount),0) FROM payments WHERE YEAR(paid_at)=YEAR(CURDATE()) AND MONTH(paid_at)=MONTH(CURDATE())')}); }));
module.exports=r;
