import { Router } from 'express';
import twilio from 'twilio';

const router = Router();

const { MessagingResponse } = twilio.twiml;


router.post('/', (req, res) => {
  
  const {Body, From} = req.body;
  console.log(`This message ${Body} is sent from ${From}`)

  const twiml = new MessagingResponse();

  twiml.message(
    'Message received! Hello again from the Twilio Sandbox for WhatsApp.'
  );

  res.type('text/xml').send(twiml.toString());
});


export default router;

