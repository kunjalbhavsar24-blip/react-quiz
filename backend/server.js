const express=require("express");
const cors=require("cors");

const app=express();

app.use(cors());
app.use(express.json());

app.use("/api",require("./routes/auth"));
app.use("/api",require("./routes/category"));
app.use("/api",require("./routes/question"));
app.use("/api",require("./routes/quizRoutes"));
app.use("/api",require("./routes/result"));

app.listen(5000,()=>{
    console.log("Server Running");
});