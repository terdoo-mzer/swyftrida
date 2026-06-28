import { prisma } from "../config/db.js";
import {
  getSession,
  createSession,
  updateSession,
  clearSession,
} from "./session.js";
import {
  stripWhatsAppNumber,
  validateUserSelection,
  MENU_HINT,
  formatDate,
} from "../utils/helpers.js";

export const handleMessage = async (from, body) => {
  // TODO(Terdoo) Check if user wants to return to main menu by sending 'MENU'
  if (body.trim().toUpperCase() === "MENU") {
    await clearSession(from);
    // return a welcome back message and ask for origin
    return `Your current session has been cleared.\nReply with Hello to start from the begining.`;
  }

  const session = await getSession(from);

  // Check if user has an existing session
  if (session) {
    // If session exists, get the step and route the user to session handler
    switch (session.step) {
      case "NEW_USER": {
        // Receive the user name, create the user,set the session step to 'ASK_ORIGIN'
        // Elicit their origin
        const user = await prisma.users.create({
          data: {
            name: body,
            phone: stripWhatsAppNumber(from),
            status: "guest",
          },
        });
        await updateSession(from, {
          step: "ASK_ORIGIN",
          name: body,
        });
        return `Hello ${body}! Where are you traveling from? Pick the number that applies:\n[1] Abuja\n[2] Lagos\n${MENU_HINT}`;
      }
      case "ASK_ORIGIN": {
        /**
         * Validate user selection against the list size, We are using 2 now since we operate only Abuja-Lagos corridors
         * When the project eveolves to more cities, make `listSize` dynamic by querying the db
         */
        const validatedOriginSelection = validateUserSelection(body, 2);
        if (!validatedOriginSelection) {
          return `Hello ${session.name}! Where are you traveling from? Pick the number that applies:\n1.Abuja\n2.Lagos\nMENU_HINT`;
        }
        // Create local list of cities
        const cities = ["abuja", "lagos"];
        const origin = cities[validatedOriginSelection - 1];
        const destination = cities.find(function (c) {
          return c.toLocaleLowerCase() !== origin;
        });

        const availbleTrips = await prisma.trips.findMany({
          where: {
            destination,
            status: "active",
            departure_time: { gt: new Date(Date.now() + 2 * 60 * 60 * 1000) },
            seats: {
                some: {
                    status: 'available'
                }
            }
          },
        });

        // If no trips available, return an appropriate response to the user
        if (availbleTrips.length === 0) {
          clearSession(from);
          return `We are sincerely sorry. There are no available trips to ${destination} currently. Please check back later\n${MENU_HINT}`;
        }

        // Format available trips like so 1.destination date amount - avalibale seats
        let formattedAvailableTrips = [];
        availbleTrips.forEach((trip, index) => {
          formattedAvailableTrips.push(
            `${index + 1}. ${trip.destination} | ${formatDate(trip.departure_time)} | ₦${trip.price}`,
          );
        });

        // Update session
        await updateSession(from, {
          step: "AWAITING_TRIP_SELECTION",
          origin: origin,
          destination: destination,
          trips: availbleTrips,
          formattedTrips: formattedAvailableTrips,
        });

        return `Here are available trips to ${destination}:\n${formattedAvailableTrips.join("\n")}\n${MENU_HINT}`;
      }
      case "AWAITING_TRIP_SELECTION": {
        const validatedTripSelection = validateUserSelection(
          body,
          session.trips.length,
        );
        console.log(`Trip selection output: ${validatedTripSelection}`);
        if (!validatedTripSelection) {
          console.log(`Current Session step: ${session.step}`);
          return `Here are available trips to ${session.destination}:\n${session.formattedTrips.join("\n")}\n${MENU_HINT}`;
        }
        const selectedTrip = session.trips[validatedTripSelection - 1];
        //console.log(`You selecte the trip with id: ${selectedTrip.id}`)
        const availableSeats = await prisma.seats.findMany({
          where: {
            trip_id: selectedTrip.id,
            status: 'available'
          },
        });
        //console.log(`Here are the availabale seats: ${availableSeats}`);
        // If no trips available, return an appropriate response to the user
        if (availableSeats.length === 0) {
          clearSession(from);
          return `We are sincerely sorry. This trip to ${session.destination} is currently filled up. Please check back later\n${MENU_HINT}`;
        }

        let formattedAvailableSeats = [];
        availableSeats.forEach((seat, index) => {
          formattedAvailableSeats.push(`[${index+1}] Seat ${seat.seat_number}`);
        });
        // Update session
        await updateSession(from, {
          step: "AWAITING_SEAT_SELECTION",
          seats: availableSeats,
          tripId: selectedTrip.id,
          formattedSeats: formattedAvailableSeats,
        });
        return `Here are the available seats for the selected trip to ${session.destination}. Pick any seat to continue:\n${formattedAvailableSeats.join("\n")}\n${MENU_HINT}`;
      }
      case "AWAITING_SEAT_SELECTION": {
        const validatedSeatSelection = validateUserSelection(
          body,
          session.seats.length,
        );
        console.log(`You selected seat no: ${validatedSeatSelection}`);
        if (!validatedSeatSelection) {
          console.log(`Current Session: ${session}`);
          return `Here are the available seats for the selected trip to ${session.destination}. Pick any seat to continue:\n${session.formattedSeats.join("\n")}\n${MENU_HINT}`;
        }

        // Start transaction here

      }
    }
    return;
  }

  // If no session,
  // check if user exists in db
  const user = await prisma.users.findUnique({
    where: { phone: stripWhatsAppNumber(from) },
  });

  if (user) {
    // If user exists, create session and greet
    await createSession(from, { name: user.name, step: "ASK_ORIGIN" });
    return `Hello ${user.name}!\nWhere are you travelling from? Pick the number that applies:\n[1] Abuja\n[2] Lagos\n${MENU_HINT}`;
  } else {
    // if user does not exist, create session and ask for their name
    await createSession(from, { step: "NEW_USER" });
    // return a response
    return `Hello! Welcome to SwyftRide.\nPlease enter your name`;
  }
};
