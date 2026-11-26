const r=require('express').Router(),bcrypt=require('bcryptjs'),jwt=require('jsonwebtoken'),db=require('../config/db');
const {auth,wrap,bad}=require('../middleware/auth');
r.post('/login',wrap(async(q,s)=>{
 const {username,password}=q.body; if(!username||!password) throw bad('Username and password required');
 const [[u]]=await db.query('SELECT u.*,r.name role FROM users u JOIN roles r ON r.id=u.role_id WHERE username=? AND active=1',[username]);
 if(!u||!(await bcrypt.compare(password,u.password_hash))) throw bad('Invalid credentials',401);
 s.json({token:jwt.sign({id:u.id,role:u.role,name:u.full_name},process.env.JWT_SECRET,{expiresIn:'8h'}),user:{name:u.full_name,role:u.role}});
}));
r.get('/me',auth(),(q,s)=>s.json(q.user));
r.post('/users',auth('manager'),wrap(async(q,s)=>{
 const {full_name,username,password,role_id}=q.body;
 if(!full_name||!username||!role_id||!password||password.length<8) throw bad('Name, username, role and 8+ char password required');
 try{ const [x]=await db.query('INSERT INTO users(full_name,username,password_hash,role_id) VALUES(?,?,?,?)',[full_name,username,await bcrypt.hash(password,10),role_id]); s.json({id:x.insertId}); }
 catch(e){ throw bad(e.code==='ER_DUP_ENTRY'?'Username taken':'Invalid role'); }
}));
module.exports=r;
