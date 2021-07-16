import axios from 'axios';
import { updateTicketSearchFailed } from '../models/tickets';

export const finish = async (
  body: FinishRequest,
  cookies: string,
  id: number
) => {
  try {
    const promise = await axios({
      headers: {
        Cookie: cookies,
      },

      method: 'post',
      url: 'https://bergencountyrba.ezlinksgolf.com/api/cart/finish',
      data: body,
    });
    return promise;
  } catch (err) {
    updateTicketSearchFailed(id, err, 'holdReservation Request');
  }
};

// Generated by https://quicktype.io

export const createFinishObj = (
  cart: any,
  loggedIn: any,
  masterSponsorID: number
) => {
  return {
    SponsorID: `${cart.SponsorID}`, // getAllItems response cart[0].SponsorID to string
    ContactID: `${loggedIn.ContactID}`, // loggedIn?.data.ContactID,
    TeeTime: cart.TeeTime,
    CourseID: `${cart.CourseID}`,
    ContinueOnPartnerTeeTimeConflict: true,
    Email1: null,
    Email2: null,
    Email3: null,
    GroupID: '26256', // '26256'
    MasterSponsorID: `${masterSponsorID}`,
    ReservationTypeID: `${cart.ReservationTypeI}`,
    SessionID: loggedIn.SessionID,
  };
};

export interface FinishRequest {
  ContinueOnPartnerTeeTimeConflict: boolean;
  Email1: null;
  Email2: null;
  Email3: null;
  SponsorID: string;
  CourseID: string;
  ReservationTypeID: string;
  SessionID: string;
  ContactID: string;
  MasterSponsorID: string;
  GroupID: string;
}

ContactID: '59989180';
ContinueOnPartnerTeeTimeConflict: true;
CourseID: '24268';
Email1: null;
Email2: null;
Email3: null;
GroupID: '26256';
MasterSponsorID: '17703';
ReservationTypeID: '50428';
SessionID: '2qkxwffxmsz30ncpsingubnq';
SponsorID: '17703';

// Generated by https://quicktype.io

export interface FinishResponse {
  ReservationName: string;
  Location: string;
  ScheduledTime: string;
  NumberOfPlayers: number;
  ReservationFee: string;
  TotalPrice: string;
  CancellationDeadline: string;
  ConfirmationNumber: string;
  IsSuccessful: boolean;
  StatusText: string;
  SponsorName: string;
  CourseName: string;
  City: string;
  State: string;
  Country: string;
  OrderID: string;
  Tax: string;
  SKU: string;
  ProductName: string;
  UnitPrice: string;
  Quantity: number;
  CaptainTeeTimeConflicts: null;
  CaptainTeeTimeConflictsFound: boolean;
  CaptainTeeTimeConflictMode: number;
  PartnerTeeTimeConflicts: null;
  PartnerTeeTimeConflictsFound: boolean;
  PartnerTeeTimeConflictMode: number;
}