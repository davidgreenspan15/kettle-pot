import axios, { AxiosResponse } from 'axios';
import { ReserveRequest } from './reservation';
import { SearchRequest } from '../types/search';
export const username = process.env.USERNAME;
export const password = process.env.PASSWORD;
export const add = async (body: AddRequest, cookies: string) => {
  try {
    const promise = await axios({
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies,
      },

      method: 'post',
      url: 'https://bergencountyrba.ezlinksgolf.com/api/cart/add',
      data: body,
    });
    return promise;
  } catch (err) {
    console.log(err);
  }
};

export const createAllCookies = (
  sessionCookies: string,
  setCookies: string[]
) => {
  const cookiesArray = [sessionCookies];
  setCookies.forEach((c: string) => {
    cookiesArray.push(c.split(';')[0]);
  });

  return cookiesArray.join('; ');
};

export const createAddObj = (
  reserveObj: ReserveRequest,
  loggedIn: AxiosResponse<any> | undefined,
  reserved: AxiosResponse<any> | undefined,
  searchObj: SearchRequest
) => {
  const allCookies = createAllCookies(
    reserveObj.cookies,
    loggedIn?.headers['set-cookie']
  );
  const addRequest: AddRequest = {
    r01: reserveObj.body.p01, // reservation request p01
    r02: reserved?.data.r02[0], // reservation response  r02[0]
    r03: searchObj.p06, //search req p06
    r04: false, // //default false
    r05: loggedIn?.data.ContactID, // // login rez "ContactID": 59989180,
    r06: false, //default false
    r07: loggedIn?.data.SessionID, //login rez   "SessionID": "eqvujslk2uocoqife4vfxmg5",
    r08: reserveObj.body.p02[0].r01, // reserve req p02[0].r01
    r09: loggedIn?.data.CsrfToken, //login rez "CsrfToken": "6528f372-2df1-4dd9-8be5-0b8779322adb",
  };
  return { addRequest, allCookies };
};

export interface AddRequest {
  r01: string; // reservation request p01
  r02: R02; // reservation response  r02[0]
  r03: number; //search req p06
  r04: boolean; // //default
  r05: number; // // login rez "ContactID": 59989180,
  r06: boolean; //default
  r07: string; //login rez   "SessionID": "eqvujslk2uocoqife4vfxmg5",
  r08: number; // reserve req p02[0].r01
  r09: string; //login rez "CsrfToken": "6528f372-2df1-4dd9-8be5-0b8779322adb",
}

export interface R02 {
  r01: string;
  r02: null;
  r03: number;
  r04: null;
  r05: number;
  r06: number;
  r07: number;
  r08: number;
  r09: string;
  r10: string;
  r11: boolean;
  r12: string;
}
