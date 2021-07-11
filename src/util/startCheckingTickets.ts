import { Ticket, Search, Prisma } from '@prisma/client';
import { createAddObj, add } from '../requests/add';
import { createSearchOBJ, search } from '../requests/search';
import { reservation, createReserveOBJ } from '../requests/reservation';
import { login } from '../requests/login';
import { getAllItems } from '../requests/getAllItems';
import { createHoldReZObj, holdReservation } from '../requests/holdReservation';
import { getAllTickets } from '../models/tickets';
import { AxiosResponse } from 'axios';
import {
  updateTicketAttempts,
  updateTicketSearchFailed,
} from '../models/tickets';
import { createSearch, addSearchResponse } from '../models/searches';

const startSearch = async (t: Ticket) => {
  const id = t.id;
  let searchTicket: Search | null = null;
  const searchObj = createSearchOBJ(t);
  let searchResponseData: any;
  let searchResponseHeaders: any;
  let reserveObj: any;
  let reserveResponseData: any;
  let reserveResponseHeaders: any;
  let loginResponseData: any;
  let loginResponseHeaders: any;
  let allItemsResponseData: any;
  let holdRezObj: any;
  let addObj: any;
  let holdResponseData: any;
  let holdResponseHeaders: any;

  try {
    await updateTicketAttempts(id, t.attempt);
  } catch (err) {
    console.log(err);
  }
  try {
    searchTicket = await createSearch(id, searchObj);
  } catch (err) {
    console.log(err);
  }
  if (searchTicket) {
    try {
      console.log(searchObj, 'starting search with this object');
      let searchResp = await search(searchObj, id);
      searchResponseData = searchResp?.data;
      searchResponseHeaders = searchResp?.headers;
    } catch (err) {
      console.log(err);
      updateTicketSearchFailed(id, err, 'Fail Search Request On Index ');
    }
    if (searchResponseData.r06.length > 0) {
      try {
        reserveObj = createReserveOBJ({
          data: searchResponseData,
          headers: searchResponseHeaders,
        });
        console.log(reserveObj, 'starting reserve Reserve Object');
        let reserved = await reservation(
          reserveObj.body,
          reserveObj.cookies,
          id
        );
        reserveResponseData = reserved?.data;
        reserveResponseHeaders = reserved?.headers;
      } catch (err) {
        console.log(err);
        updateTicketSearchFailed(id, err, 'Fail Reservation Request On Index');
      }
      try {
        console.log(
          {
            data: reserveResponseData.r02[0].r06,
            cookies: reserveObj.cookies,
          },
          'starting login  with these'
        );
        let loggedIn = await login(
          reserveResponseData.r02[0].r06,
          reserveObj.cookies,
          id
        );
        loginResponseData = loggedIn?.data;
        loginResponseHeaders = loggedIn?.headers;
      } catch (err) {
        console.log(err);
        updateTicketSearchFailed(id, err, 'Fail Login Request On Index');
      }
      try {
        addObj = createAddObj(
          reserveObj,
          { data: loginResponseData, headers: loginResponseHeaders },
          { data: reserveResponseData, headers: reserveResponseHeaders },
          searchObj
        );
        console.log(addObj, 'logging in with add obj');
        const { addRequest, allCookies } = addObj;
        let added = await add(addRequest, allCookies, id);
      } catch (err) {
        console.log(err);
        updateTicketSearchFailed(id, err, 'Fail Add Item On Index');
      }
      try {
        console.log(addObj, 'getAllItems with add obj');

        let allItems = await getAllItems(addObj.allCookies, id);
        allItemsResponseData = allItems?.data;
      } catch (err) {
        console.log(err);
        updateTicketSearchFailed(
          id,
          err,
          'Fail Get All Items Request on Index'
        );
      }
      try {
        holdRezObj = createHoldReZObj(
          allItemsResponseData.CartItems[0].SponsorID,
          loginResponseData,
          reserveResponseData.r02[0].r06
        );
        console.log(holdRezObj, 'holding reservation with holdrezobj');
        const holdResponse = await holdReservation(
          holdRezObj,
          addObj.allCookies,
          id
        );
        holdResponseData = holdResponse?.data;
        holdResponseHeaders = holdResponse?.headers;
      } catch (err) {
        console.log(err);
        updateTicketSearchFailed(
          id,
          err,
          'Start HoldReservation Request On Index'
        );
      }
    }
  }
  return true;
};
export const handleSearch = async () => {
  let tickets: Ticket[] = [];

  try {
    tickets = await getAllTickets();
  } catch (err) {
    console.log(err);
  }

  tickets.forEach(async ticket => {
    if (ticket.status === 'searching') {
      await Promise.resolve(startSearch(ticket));
      // const id = ticket.id;
      // const searchObj = createSearchOBJ(ticket);
      // try {
      //   console.log(searchObj, 'starting search with this object');
      //   console.log(id);
      //   let searchResp = await search(searchObj, id);
      //   console.log(searchResp?.data.r06);
      //   if (searchResp?.data.r06.length > 0) {
      //     let reserveObj = createReserveOBJ(searchResp);
      //     try {
      //       console.log(reserveObj, 'starting reserve Reserve Object');
      //       let reserved = await reservation(
      //         reserveObj.body,
      //         reserveObj.cookies,
      //         id
      //       );
      //       console.log(reserved);
      //       try {
      //         console.log(
      //           {
      //             data: reserved?.data.r02[0].r06,
      //             cookies: reserveObj.cookies,
      //           },
      //           'starting login  with these'
      //         );
      //         let loggedIn = await login(
      //           reserved?.data.r02[0].r06,
      //           reserveObj.cookies,
      //           id
      //         );
      //         try {
      //           let addOBj = createAddObj(
      //             reserveObj,
      //             loggedIn,
      //             reserved,
      //             searchObj
      //           );
      //           console.log(addOBj, 'logging in with add obj');
      //           const { addRequest, allCookies } = addOBj;
      //           let added = await add(addRequest, allCookies, id);
      //           try {
      //             let allItems = await getAllItems(addOBj.allCookies, id);
      //             const holdRezObj = createHoldReZObj(
      //               allItems?.data.CartItems[0].SponsorID,
      //               loggedIn?.data,
      //               reserved?.data.r02[0].r06
      //             );
      //             try {
      //               console.log(
      //                 holdRezObj,
      //                 'holding reservation with holdrezobj'
      //               );
      //               const holdResponse = await holdReservation(
      //                 holdRezObj,
      //                 allCookies,
      //                 id
      //               );
      //               // res.json({
      //               //   holdRezObj,
      //               //   data: holdResponse?.data,
      //               //   header: holdResponse?.headers,
      //               // });
      //               // up to here
      //             } catch (err) {
      //               updateTicketSearchFailed(
      //                 id,
      //                 err,
      //                 'Start HoldReservation Request On Index'
      //               );
      //             }
      //           } catch (err) {
      //             updateTicketSearchFailed(
      //               id,
      //               err,
      //               'Start GetAllItems Request on Index'
      //             );
      //           }
      //         } catch (err) {
      //           updateTicketSearchFailed(id, err, 'Start Add Request On Index');
      //         }
      //       } catch (err) {
      //         updateTicketSearchFailed(id, err, 'Start Login Request On Index');
      //       }
      //     } catch (err) {
      //       updateTicketSearchFailed(
      //         id,
      //         err,
      //         'Start Reservation Request On Index'
      //       );
      //     }
      //   }
      // } catch (err) {
      //   updateTicketSearchFailed(id, err, 'Start Search Request On Index ');
      // }
    }
  });
  return tickets;
};
