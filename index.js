const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');
// const { constants } = require('buffer');

app.use(cookieParser())
dotenv.config({ path: './config.env' });
const PORT = process.env.PORT || 4000;

require('./DB/conn');
// app.use(express.urlencoded());
app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use(require('./router/auth'));


app.use(express.static(path.join(__dirname, './client/build')))

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
})


app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
