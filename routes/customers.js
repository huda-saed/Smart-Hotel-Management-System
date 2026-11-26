const r=require('express').Router(),db=require('../config/db'),{auth,wrap,bad}=require('../middleware/auth');
const R=['manager','receptionist'];
r.get('/',auth(...R,'accountant'),wrap(async(q,s)=>{ const t='%'+(q.query.q||'')+'%';
 const [x]=await db.query('SELECT * FROM customers WHERE full_name LIKE ? OR phone LIKE ? OR email LIKE ? ORDER BY id DESC LIMIT 200',[t,t,t]); s.json(x); }));
r.get('/:id/bookings',auth(...R),wrap(async(q,s)=>{
 const [x]=await db.query('SELECT b.*,r.room_number FROM bookings b JOIN rooms r ON r.id=b.room_id WHERE customer_id=? ORDER BY b.id DESC',[q.params.id]); s.json(x); }));
const val=b=>{ if(!b.full_name||!b.phone) throw bad('Name and phone required'); if(b.email&&!/^\S+@\S+\.\S+$/.test(b.email)) throw bad('Invalid email'); };
r.post('/',auth(...R),wrap(async(q,s)=>{ val(q.body); const b=q.body;
 const [x]=await db.query('INSERT INTO customers(full_name,email,phone,address,id_number) VALUES(?,?,?,?,?)',[b.full_name,b.email||null,b.phone,b.address||null,b.id_number||null]); s.json({id:x.insertId}); }));
r.put('/:id',auth(...R),wrap(async(q,s)=>{ val(q.body); const b=q.body;
 await db.query('UPDATE customers SET full_name=?,email=?,phone=?,address=?,id_number=? WHERE id=?',[b.full_name,b.email||null,b.phone,b.address||null,b.id_number||null,q.params.id]); s.json({ok:1}); }));
r.delete('/:id',auth('manager'),wrap(async(q,s)=>{
 try{await db.query('DELETE FROM customers WHERE id=?',[q.params.id]); s.json({ok:1});}catch{throw bad('Customer has bookings',409);} }));
module.exports=r;
