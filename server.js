const { default: mongoose } = require("mongoose");
const app = require("./app");
const { MONGODB_URI, PORT } = require("./utils/config");

mongoose.connect(MONGODB_URI)
.then(()=>{
     console.log("database connected successfully");      
    // add listner
    app.listen(PORT , ()=>{
        console.log(`Server is running on http://localhost:${PORT}`);
    })
}).catch(()=>{
    console.log("database is not connected")
})