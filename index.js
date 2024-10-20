const dbConnect=require('./Config/dbConnect');
const fileUpload=require('express-fileupload');
const cookieParser = require('cookie-parser')
const express=require('express');
const cors = require("cors");
const app=express();
const authRoutes=require('./Routes/authRoutes');
const userRoutes=require('./Routes/userRoutes');
const groupRoutes=require('./Routes/groupRoutes');
const expensesRoutes=require('./Routes/expensesRoutes');

require('dotenv').config();
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


app.get('/',(req,res)=>{
    res.send("Hello from server");
})

// authRoutes endpoints
app.use('/api/v1/auth',authRoutes);

// User's routes
app.use('/api/v1/user',userRoutes);

// group's routes
app.use('/api/v1/groups',groupRoutes);

// expenses's routes
app.use('/api/v1/expense',expensesRoutes);


const PORT=process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
});

dbConnect();