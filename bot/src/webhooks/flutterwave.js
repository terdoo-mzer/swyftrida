import { Router } from "express"; 
import { prisma } from '../config/db.js'
import { isFlutterwaveSignatureValid } from './validateWebhook.js'

const router = Router();

router.post('/', async (req, res) => {
    console.log(req.bufferLoad)
    const signature = req.headers['flutterwave-signature'];
    const isValid = isFlutterwaveSignatureValid(req.rawBody,signature,process.env.FLW_WEBHOOK_SECRET_HASH)
    if(!isValid) {
        return res.sendStatus(401)
    }
    await prisma.payment_events.create({
        date: {
            booking_id: "",
            type: "webhook_received",
            status: req.body.data.status,
            payload: {},
            external_id: ""
        }
    })
     return res.sendStatus(200)
})

export default router;