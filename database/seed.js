require('dotenv').config(); const bcrypt=require('bcryptjs'); const db=require('../config/db');
(async()=>{
 const users=[['Super Admin','admin',1],['Hotel Manager','manager',2],['Receptionist','reception',3],['Accountant','accountant',4],['Housekeeper','housekeeping',5],['Restaurant Staff','restaurant',6]];
 for(const [n,u,r] of users) await db.query('INSERT IGNORE INTO users(full_name,username,password_hash,role_id) VALUES(?,?,?,?)',[n,u,await bcrypt.hash('Password123!',10),r]);
 const rooms=[['101',1,60],['102',2,90],['201',3,95],['202',4,140],['301',5,190],['401',6,320]];
 for(const [n,t,p] of rooms) await db.query('INSERT IGNORE INTO rooms(room_number,type_id,price,description) VALUES(?,?,?,?)',[n,t,p,'Demo room']);
 await db.query("INSERT IGNORE INTO customers(id,full_name,email,phone) VALUES(1,'Jane Guest','jane@example.com','555-0100')");
 console.log('Seeded.'); process.exit();
})();
