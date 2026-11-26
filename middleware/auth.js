const jwt=require('jsonwebtoken');
exports.auth=(...roles)=>(req,res,next)=>{
 try{ const t=(req.headers.authorization||'').replace('Bearer ',''); req.user=jwt.verify(t,process.env.JWT_SECRET); }
 catch{ return res.status(401).json({error:'Not authenticated'}); }
 if(roles.length&&!roles.includes(req.user.role)&&req.user.role!=='super_admin') return res.status(403).json({error:'Forbidden'});
 next();
};
exports.wrap=fn=>(req,res)=>fn(req,res).catch(e=>{console.error(e);res.status(e.status||500).json({error:e.status?e.message:'Server error'});});
exports.bad=(m,s=400)=>Object.assign(new Error(m),{status:s});
