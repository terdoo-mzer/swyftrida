import { Router } from 'express';
import twilio from 'twilio';
import { handleMessage } from '../state/machine.js';

const router = Router();

const { MessagingResponse } = twilio.twiml;


router.post('/', async (req, res) => {
  
  const {Body, From} = req.body;

  // Handle the incoming message and get a response
    const responseMessage = await handleMessage(From, Body);

  const twiml = new MessagingResponse();

  twiml.message(
    responseMessage || 'Message received! Hello again from the Twilio Sandbox for WhatsApp.'
  );

  res.type('text/xml').send(twiml.toString());
});


export default router;

