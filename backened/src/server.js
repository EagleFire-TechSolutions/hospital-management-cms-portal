import {app} from "./app.js";

import dbconnection from "./db/index.js";

dbconnection()
.then(()=>{
    console.log("DB connected");
    
})
.catch((err)=>{
    console.log(err);
    
});

const PORT = process.env.PORT ||2000;
console.log("server is runong");

app.listen(PORT || process.env.PORT, (req , res) => {
    console.log(`Server is runing at ${process.env.PORT}`);
    
});


