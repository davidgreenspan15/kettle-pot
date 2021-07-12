import { Ticket, Search, Prisma } from '@prisma/client';
import { createAddObj, add } from '../requests/add';
import { createSearchOBJ, search } from '../requests/search';
import { reservation, createReserveOBJ } from '../requests/reservation';
import { login } from '../requests/login';
import { getAllItems } from '../requests/getAllItems';
import { createHoldReZObj, holdReservation } from '../requests/holdReservation';
import { getAllTickets, updateTicketComplete } from '../models/tickets';
import { AxiosResponse } from 'axios';
import {
  updateTicketAttempts,
  updateTicketSearchFailed,
} from '../models/tickets';
import { createSearch, updateSearchesStatus } from '../models/searches';
import {
  createTeeTimeConflictObj,
  teeTimeConflict,
} from '../requests/teeTimeConflict';
import { createResponse } from '../models/responses';
import { createFinishObj, finish } from '../requests/finish';
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
  let teeTimeCoflictObj: any;
  let ttConflictResponseData: any;
  let ttConflictResponseHeaders: any;
  let finishObj: any;
  let finishResponseData: any;
  try {
    await updateTicketAttempts(id, t.attempt);
  } catch (err) {
    console.log(err);
  }
  try {
    searchTicket = await createSearch(id);
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
      await updateSearchesStatus(searchTicket.id, err, 'Failed Search');
      await updateTicketSearchFailed(id, err, 'Fail Search Request On Index ');
    }
    if (searchResponseData.r06.length > 0) {
      try {
        await updateSearchesStatus(
          searchTicket.id,
          '',
          'Start Reservation Process'
        );

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
        await updateSearchesStatus(
          searchTicket.id,
          err,
          'Failed Reservation Process'
        );

        await updateTicketSearchFailed(
          id,
          err,
          'Fail Reservation Request On Index'
        );
      }
      try {
        await updateSearchesStatus(searchTicket.id, '', 'Start Login Process');
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
        await updateSearchesStatus(
          searchTicket.id,
          err,
          'Failed Login Process'
        );

        await updateTicketSearchFailed(id, err, 'Fail Login Request On Index');
      }
      try {
        await updateSearchesStatus(searchTicket.id, '', 'Start Add Process');

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
        await updateSearchesStatus(searchTicket.id, err, 'Failed Add Process');

        await updateTicketSearchFailed(id, err, 'Fail Add Item On Index');
      }
      try {
        await updateSearchesStatus(
          searchTicket.id,
          '',
          'Start Get All Items Process'
        );

        console.log(addObj, 'getAllItems with add obj');

        let allItems = await getAllItems(addObj.allCookies, id);
        allItemsResponseData = allItems?.data;
      } catch (err) {
        console.log(err);
        await updateSearchesStatus(
          searchTicket.id,
          err,
          'Failed Get All Items Process'
        );

        await updateTicketSearchFailed(
          id,
          err,
          'Fail Get All Items Request on Index'
        );
      }
      try {
        await updateSearchesStatus(
          searchTicket.id,
          '',
          'Start Hold Reservation Process'
        );
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
        await updateSearchesStatus(
          searchTicket.id,
          err,
          'Failed Hold Reservation Process'
        );
        console.log(err);
        await updateTicketSearchFailed(
          id,
          err,
          'Start HoldReservation Request On Index'
        );
      }
      try {
        await updateSearchesStatus(
          searchTicket.id,
          '',
          'Start Check Time Conlfict Process'
        );
        teeTimeCoflictObj = createTeeTimeConflictObj(
          allItemsResponseData.CartItems[0],
          loginResponseData
        );

        const ttConflict = await teeTimeConflict(
          teeTimeCoflictObj,
          addObj.allCookies,
          id
        );
        ttConflictResponseData = ttConflict?.data;
        ttConflictResponseHeaders = ttConflict?.headers;
      } catch (err) {
        await updateSearchesStatus(
          searchTicket.id,
          err,
          'Failed Check Time Conlfict Process'
        );
        console.log(err);
        await updateTicketSearchFailed(
          id,
          err,
          'Start Check Tee Time Conflict Request On Index'
        );
      }
      try {
        await updateSearchesStatus(searchTicket.id, '', 'Start Finish Process');
        finishObj = await createFinishObj(
          allItemsResponseData.CartItems[0],
          loginResponseData,
          reserveResponseData.r02[0].r06
        );
        const finishedRez = await finish(finishObj, addObj.allCookies, id);
        finishResponseData = finishedRez?.data;
        await updateTicketComplete(id);
        await updateSearchesStatus(searchTicket.id, '', 'Completed!');
        console.log(finishedRez?.data, 'responnse data');
        await createResponse(searchTicket.id, finishResponseData);
      } catch (err) {
        console.log(err);
        await updateSearchesStatus(
          searchTicket.id,
          err,
          'Failed Finish Process'
        );
        await updateTicketSearchFailed(
          id,
          err,
          'Start Finish Booking Request On Index'
        );
      }
    }
  }
  return finishResponseData;
};

export const handleSearch = async () => {
  let tickets: Ticket[] = [];
  const searchResponses: any = [];

  try {
    tickets = await getAllTickets();
  } catch (err) {
    console.log(err);
  }

  tickets.forEach(async ticket => {
    if (ticket.status === 'searching') {
      let search = await Promise.resolve(startSearch(ticket));
      searchResponses.push(search);
    }
  });
  return { searchResponses, tickets };
};
