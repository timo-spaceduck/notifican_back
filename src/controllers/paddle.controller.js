import { Paddle, EventName, Environment, LogLevel } from '@paddle/paddle-node-sdk';
import dotenv from 'dotenv';
dotenv.config();

const paddle = new Paddle(process.env.PADDLE_API_KEY, {
    // environment: Environment.sandbox,
    logLevel: LogLevel.verbose
})

const paddleController = {
    handleWebhook: async (req, res) => {
        try {
            const signature = req.headers['paddle-signature'];

            if (!signature) {
                return res.status(400).json({ error: 'Missing Paddle signature' });
            }

            if (!Buffer.isBuffer(req.body)) {
                console.error("Request body is not a buffer");
            }

            const eventData = await paddle.webhooks.unmarshal(req.body.toString(), process.env.PADDLE_WEBHOOK_KEY, signature);

            console.log('eventData', eventData);

            switch (eventData.eventType) {
                // case EventName.SubscriptionCreated:
                //     await handleSubscriptionCreated(eventData);
                //     break;
                // case 'subscription.updated':
                //     await handleSubscriptionUpdated(eventData);
                //     break;
                // case 'subscription.canceled':
                //     await handleSubscriptionCanceled(eventData);
                //     break;
                case EventName.TransactionCompleted:
                    await handleTransactionCompleted(eventData);
                    break;
                // case 'transaction.refunded':
                //     await handleTransactionRefunded(event);
                //     break;
                default:
                    console.log(`Unhandled Paddle event: ${eventData.eventType}`);
            }

            res.status(200).json({ message: 'Webhook processed successfully' });
        } catch (error) {
            console.error('Error processing Paddle webhook:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

// async function handleSubscriptionCreated(event) {
//     console.log('Subscription created:', event.data);
// }
//
// async function handleSubscriptionUpdated(event) {
//     console.log('Subscription updated:', event.data);
// }
//
// async function handleSubscriptionCanceled(event) {
//     console.log('Subscription canceled:', event.data);
// }

async function handleTransactionCompleted(event) {
    console.log('Transaction completed:', event);
}

// async function handleTransactionRefunded(event) {
//     console.log('Transaction refunded:', event.data);
// }

export default paddleController;
