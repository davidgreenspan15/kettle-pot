import express from 'express';
import { search, createSearchOBJ } from './requests/search';

import { PrismaClient, Ticket } from '@prisma/client';
import { getUserByEmail, getUserById, createUser } from './models/user';
import { createTicket, getAllTickets, getTickets } from './models/tickets';
import {
  createReserveOBJ,
  reservation,
  ReserveRequest,
} from './requests/reservation';
import { login } from './requests/login';
import { AddRequest, createAllCookies, add } from './requests/add';
import { AxiosResponse } from 'axios';
import { SearchRequest } from './types/search';
import { createAddObj } from './requests/add';
import { getAllItems } from './requests/getAllItems';
import { createHoldReZObj, holdReservation } from './requests/holdReservation';
import { updateTicketSearchFailed } from './models/tickets';
const prisma = new PrismaClient();
const app = express();
const PORT = 8000;
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', '*');
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
export const username = process.env.USERNAME;
export const password = process.env.PASSWORD;
// SEARCH REQUEST
app.get('/search', async (req, res) => {
  let tickets: Ticket[] = [];
  try {
    tickets = await getAllTickets();
    console.log(tickets, 'got tickets');
    tickets.forEach(async ticket => {
      const id = ticket.id;
      const searchObj = createSearchOBJ(ticket);
      try {
        console.log(searchObj, 'starting search with this object');
        let searchResp = await search(searchObj, id);
        if (searchResp?.data.r06.length > 0) {
          let reserveObj = createReserveOBJ(searchResp);
          try {
            console.log(reserveObj, 'starting reserve Reserve Object');
            let reserved = await reservation(
              reserveObj.body,
              reserveObj.cookies,
              id
            );
            try {
              console.log(
                {
                  data: reserved?.data.r02[0].r06,
                  cookies: reserveObj.cookies,
                },
                'starting login  with these'
              );
              let loggedIn = await login(
                reserved?.data.r02[0].r06,
                reserveObj.cookies,
                id
              );

              try {
                let addOBj = createAddObj(
                  reserveObj,
                  loggedIn,
                  reserved,
                  searchObj
                );
                console.log(addOBj, 'logging in with add obj');
                const { addRequest, allCookies } = addOBj;
                let added = await add(addRequest, allCookies, id);
                try {
                  let allItems = await getAllItems(addOBj.allCookies, id);
                  const holdRezObj = createHoldReZObj(
                    allItems?.data.CartItems[0].SponsorID,
                    loggedIn?.data,
                    reserved?.data.r02[0].r06
                  );
                  try {
                    console.log(
                      holdRezObj,
                      'holding reservation with holdrezobj'
                    );
                    const holdResponse = await holdReservation(
                      holdRezObj,
                      allCookies,
                      id
                    );
                    // res.json({
                    //   holdRezObj,
                    //   data: holdResponse?.data,
                    //   header: holdResponse?.headers,
                    // });
                    // up to here
                  } catch (err) {
                    updateTicketSearchFailed(
                      id,
                      err,
                      'Start HoldReservation Request On Index'
                    );
                  }
                } catch (err) {
                  updateTicketSearchFailed(
                    id,
                    err,
                    'Start GetAllItems Request on Index'
                  );
                }
              } catch (err) {
                updateTicketSearchFailed(id, err, 'Start Add Request On Index');
              }
            } catch (err) {
              updateTicketSearchFailed(id, err, 'Start Login Request On Index');
            }
          } catch (err) {
            updateTicketSearchFailed(
              id,
              err,
              'Start Reservation Request On Index'
            );
          }
        }
      } catch (err) {
        updateTicketSearchFailed(id, err, 'Start Search Request On Index ');
      }
      res.json({
        tickets,
      });
    });
  } catch (err) {
    res.status(500).json({ message: `failed to get Tickets ${err}` });
  }
  // finally {
  //   try {
  //     tickets = await getAllTickets();
  //     res.status(200).json(tickets);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
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
