
export interface Speaker {
  name: string;
  designation: string;
  bio: string;
}

export interface EventFormData {
  title: string;
  shortDescription: string;
  description: string;

  categoryId: string;
  subcategory: string;
  tags: string[];

  eventType: "ONLINE" | "OFFLINE" | "HYBRID";

  startDateTime: string;
  endDateTime: string;

  venueId: string;
  venueName: string;
  venueAddress: string;
  city: string;

  speakers: Speaker[];

  bannerUrl: string;

  ticketType: "FREE" | "PAID";
  ticketPrice: number;
  registrationLink: string;
}

export const initialEventData: EventFormData = {
  title: "",
  shortDescription: "",
  description: "",

  categoryId: "",
  subcategory: "",
  tags: [],

  eventType: "OFFLINE",

  startDateTime: "",
  endDateTime: "",

  venueId: "",
  venueName: "",
  venueAddress: "",
  city: "",

  speakers: [],

  bannerUrl: "",

  ticketType: "FREE",
  ticketPrice: 0,
  registrationLink: "",
};
