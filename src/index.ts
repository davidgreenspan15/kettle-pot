import express from 'express';
import { search } from './requests/search';
import { ReserveResponse } from './types/reserve';
import { reservation } from './requests/reservation';
// rest of the code remains same
const app = express();
const PORT = 8000;
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  // res.header('Content-Type', 'application/json');
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// SEARCH REQUEST
app.post('/search', (req, res) => {
  search(req.body)
    .response.then((data: any) => {
      res.json({ headers: data.headers, data: data.data, status: data.status });
    })
    .catch((err: any) => {
      console.log(err);
    });
});

app.post('/reserve', (req, res) => {
  // console.log({ p01, p02 });
  reservation(req.body.data, req.body.cookies)
    .response.then((data: ReserveResponse) => {
      res.json({ headers: data.headers, data: data.data, status: data.status });
    })
    .catch((err: any) => {
      console.log(err);
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
