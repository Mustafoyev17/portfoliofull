import express from 'express';
import mongoose from 'mongoose';
import bp from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.mjs'

const app = express();
const PORT = 3000;

// middleware
app.use(express.static('public'));
app.use(bp.urlencoded({extended: true}));
app.use(bp.json());
app.use(cookieParser());
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://user1:1234sss@cluster0.u7wp4gl.mongodb.net/node_auth?retryWrites=true&w=majority&appName=Cluster0;'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {
    console.log('Connected successfully:')
    app.listen(PORT);
  })
  .catch((err) => console.log(err));

  //routes

app.get('/home', (req, res) => res.render('home'));
app.use(authRoutes);