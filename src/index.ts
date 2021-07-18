import { Ticket } from '@prisma/client';
import express from 'express';

import {
  createTicket,
  getAllTickets,
  getTickets,
  cancelTicket,
} from './models/tickets';
import { createUser, getUserByEmail, getUserById } from './models/user';
import { handleSearch } from './util/startCheckingTickets';
import cron from 'node-cron';
const app = express();
const PORT = process.env.PORT || 8000;
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,Content-Type'
  );

  // res.setHeader('Access-Control-Allow-Credentials', 'false');

  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
export const username = process.env.USERNAME;
export const password = process.env.PASSWORD;
// SEARCH REQUEST

// let task = cron.schedule('*/2 * * * *', async () => {
//   try {
//     await handleSearch();
//   } catch (err) {
//     console.log(err);
//   }
// });
// task.start();
app.get('/search', async (req, res) => {
  try {
    let response = await Promise.resolve(handleSearch());

    res.json({
      response,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error Running search' });
  }
});

app.post('/users', async (req, res) => {
  let user = await getUserByEmail(req.body.email);
  if (user) {
    res.status(502).json({ message: 'Email Already Exists' });
  } else if (!user) {
    user = await createUser(req.body.name, req.body.email);
    res.status(200).json(user);
  }
});

app.post('/login', async (req, res) => {
  let user = await getUserByEmail(req.body.email);
  if (!user || (user && req.body.name !== user.name)) {
    res.status(502).json({ message: 'Invalid Credentials' });
  } else {
    res.status(200).json(user);
  }
});
app.post('/autoLogin', async (req, res) => {
  let user = await getUserById(req.body.id);
  if (!user) {
    res.status(502).json({ message: 'No Users Found' });
  } else {
    res.status(200).json(user);
  }
});
app.post('/tickets', async (req, res) => {
  try {
    let ticket = await createTicket(req.body);
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
app.post('/tickets/:id/cancel', async (req, res) => {
  try {
    let ticket = await cancelTicket(parseInt(req.params.id));
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.post('/tickets/:uuid', async (req, res) => {
  req.params.uuid;
  try {
    let tickets = await getTickets(req.params.uuid);
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
