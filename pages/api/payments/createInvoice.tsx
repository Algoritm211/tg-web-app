import { NextApiRequest, NextApiResponse } from 'next';
import { NewInvoiceParameters } from 'telegraf/typings/telegram-types';
import { ProductItem } from '../../../typings';
import { bot } from '../../../bot/botInstance';

interface NextCustomAPIRequest extends NextApiRequest {
  body: {
    // User's chat id
    id: number;
    userName: string;
    items: Array<ProductItem>;
    // Some random string
    orderNumber: number;
  };
}

interface InvoiceProps {
  id: number;
  title: string;
  userName: string;
  prices: NewInvoiceParameters['prices'];
}

const getInvoice = ({ id, title, userName, prices }: InvoiceProps) => {
  const invoice: NewInvoiceParameters = {
    chat_id: id, // Unique identifier of the target chat or username of the target channel
    provider_token: process.env.PROVIDER_TOKEN!, // token issued via bot some payment bot
    start_parameter: 'get_access', // Unique parameter for deep links. If you leave this field blank, forwarded copies of the forwarded message will have a Pay button that allows multiple users to pay directly from the forwarded message using the same account. If not empty, redirected copies of the sent message will have a URL button with a deep link to the bot (instead of a payment button) with a value used as an initial parameter.
    title, // Product name, 1-32 characters
    description: `Заказ для ${userName}`, // Product description, 1-255 characters
    currency: 'UAH', // ISO 4217 Three-Letter Currency Code
    photo_url: 'public/clothesLogo.png',
    prices, // Price breakdown, serialized list of components in JSON format 100 kopecks * 100 = 100 uah
    // @ts-ignore mistake in build-in types
    payload: {
      // The payload of the invoice, as determined by the bot, 1-128 bytes. This will not be visible to the user, use it for your internal processes.
      unique_id: `${id}_${Number(new Date())}`,
      provider_token: process.env.PROVIDER_TOKEN,
    },
  };

  return invoice;
};

const createInvoice = async (req: NextCustomAPIRequest, res: NextApiResponse) => {
  console.log("Okay, let's go!");
  try {
    const { id, userName, orderNumber, items } = req.body;
    const prices: NewInvoiceParameters['prices'] = items.map((item) => {
      return {
        label: item.title,
        amount: item.price * 100,
      };
    });

    let textForUser = `<b>Вы заказали</b>\n\n`;
    for (let i = 0; i < items.length; i++) {
      textForUser += `▪️ <i>${items[i].title}</i> - <b>${items[i].price} грн</b>\n`;
    }
    const sum = items.reduce((previousValue, currentValue) => previousValue + currentValue.price, 0);
    textForUser += `\nВсего: <b>${sum} грн</b>`;

    await bot.telegram.sendMessage(id, textForUser, { parse_mode: 'HTML' });

    await bot.telegram.sendInvoice(
      id,
      getInvoice({
        id,
        title: `Ваш заказ #${orderNumber}`,
        prices,
        userName,
      })
    );

    return res.status(200).json({ message: 'OK' });
  } catch (error) {
    return res.status(500);
  }
};

export default createInvoice;
