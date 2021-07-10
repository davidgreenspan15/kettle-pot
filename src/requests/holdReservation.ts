import axios from 'axios';

export const holdReservation = async (
  body: HoldReservationRequest,
  cookies: string
) => {
  try {
    const promise = await axios({
      headers: {
        Cookie: cookies,
      },

      method: 'post',
      url: 'https://bergencountyrba.ezlinksgolf.com/api/cart/holdreservation',
      data: body,
    });
    return promise;
  } catch (err) {
    console.log(err);
  }
};

export interface HoldReservationRequest {
  PriceWindowIDs: null;
  SponsorID: string; // getAllItems response cart[0].SponsorID to string
  ContactID: number; // loggedIn?.data.ContactID,
  SessionID: string; //loggedIn?.data.SessionID
  MasterSponsorID: string; // from loggin req MasterSponsorID
}

export const createHoldReZObj = (
  sponsorID: number,
  loggedIn: any,
  masterSponsorID: number
) => {
  return {
    PriceWindowIDs: null,
    SponsorID: `${sponsorID}`, // getAllItems response cart[0].SponsorID to string
    ContactID: loggedIn.ContactID, // loggedIn?.data.ContactID,
    SessionID: loggedIn.SessionID, //loggedIn?.data.SessionID
    MasterSponsorID: `${masterSponsorID}`,
  };
};
