const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const classesRoutes = require("./routes/classesRoutes");
const memberRoutes = require("./routes/memberRoutes");
const itemRoutes = require("./routes/itemRoutes");
const warehouses = require("./routes/warehouses");
const absences = require("./routes/absences");
const holidays = require("./routes/holidays");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());

dotenv.config();

let uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.te788iv.mongodb.net/lookup-24-april?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PORT}`);
});

app.use("/", userRoutes);
//orderRoutes
app.use("/order", orderRoutes);
//inventoryRoutes
app.use("/inventory", inventoryRoutes);
//classesRoutes
app.use("/classes", classesRoutes);
//memberRoutes
app.use("/member", memberRoutes);
//itemRoutes
app.use("/item", itemRoutes);
//warehouses
app.use("/warehouses", warehouses);
//absences
app.use("/absences", absences);
//holidays
app.use("/holidays", holidays);
