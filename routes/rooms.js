const r=require('express').Router(),db=require('../config/db'),{auth,wrap,bad}=require('../middleware/auth');
const ST=['Available','Occupied','Reserved','Maintenance','Cleaning'];
r.get('/',auth(),wrap(async(q,s)=>{
 let sql='SELECT r.*,t.name type FROM rooms r JOIN room_types t ON t.id=r.type_id WHERE 1',p=[];
 if(q.query.status){sql+=' AND r.status=?';p.push(q.query.status);} if(q.query.q){sql+=' AND (r.room_number LIKE ? OR t.name LIKE ?)';p.push('%'+q.query.q+'%','%'+q.query.q+'%');}
 const [x]=await db.query(sql+' ORDER BY room_number',p); s.json(x);
}));
r.get('/available',auth(),wrap(async(q,s)=>{
 const {check_in,check_out}=q.query; if(!check_in||!check_out||check_out<=check_in) throw bad('Valid dates required');
 const [x]=await db.query(`SELECT r.*,t.name type FROM rooms r JOIN room_types t ON t.id=r.type_id WHERE r.status NOT IN('Maintenance') AND r.id NOT IN
 (SELECT room_id FROM bookings WHERE status IN('Confirmed','CheckedIn') AND check_in<? AND check_out>?)`,[check_out,check_in]); s.json(x);
}));
const val=b=>{ if(!b.room_number||!b.type_id||!(b.price>0)) throw bad('Room number, type and positive price required'); if(b.status&&!ST.includes(b.status)) throw bad('Bad status'); };
r.post('/',auth('manager'),wrap(async(q,s)=>{ val(q.body); const b=q.body;
 try{const [x]=await db.query('INSERT INTO rooms(room_number,type_id,price,description,status) VALUES(?,?,?,?,?)',[b.room_number,b.type_id,b.price,b.description||'',b.status||'Available']); s.json({id:x.insertId});}
 catch(e){throw bad(e.code==='ER_DUP_ENTRY'?'Room number exists':'Invalid type');} }));
r.put('/:id',auth('manager','housekeeping'),wrap(async(q,s)=>{ const b=q.body;
 if(q.user.role==='housekeeping'){ if(!ST.includes(b.status)) throw bad('Bad status'); await db.query('UPDATE rooms SET status=? WHERE id=?',[b.status,q.params.id]); return s.json({ok:1}); }
 val(b); await db.query('UPDATE rooms SET room_number=?,type_id=?,price=?,description=?,status=? WHERE id=?',[b.room_number,b.type_id,b.price,b.description||'',b.status||'Available',q.params.id]); s.json({ok:1}); }));
r.delete('/:id',auth('manager'),wrap(async(q,s)=>{
 try{await db.query('DELETE FROM rooms WHERE id=?',[q.params.id]); s.json({ok:1});}catch{throw bad('Room has bookings and cannot be deleted',409);} }));
module.exports=r;
