import { bot } from "../../../bot/botInstance"
import {NextApiRequest, NextApiResponse} from "next";
import {NewInvoiceParameters} from "telegraf/typings/telegram-types";

const BASE_PATH =
  process.env.VERCEL_ENV === 'production'
    ? 'https://tg-web-app-iota.vercel.app'
    : 'http://localhost:3000'

const getInvoice = (id: number): NewInvoiceParameters => {

  const invoice: NewInvoiceParameters = {
    chat_id: id,
    provider_token: process.env.PROVIDER_TOKEN!,
    start_parameter: 'get_access',
    title: 'Футболка белая',
    description: 'Ваша белая потрясающая футболка',
    currency: 'UAH',
    photo_url: 'https://images.izi.ua/56530430',
    prices: [
      {label: 'Свитер', amount: 100 * 100},
      {label: 'Футболка', amount: 100 * 100}
    ],
    // @ts-ignore mistake in types
    payload: {
      unique_id: `${id}_${Number(new Date())}`,
      provider_token: process.env.PROVIDER_TOKEN!
    }
  }

  return invoice as NewInvoiceParameters
}

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => {
  bot.telegram.sendMessage(
    ctx.message.chat.id,
    '<b>Вы заказали</b>\n\n<i>Cвитер</i> - <b>100 грн</b>\n<i>Футболка</i> - <b>100 грн</b>\n\nВсего: <b>200 грн</b>',
    {parse_mode: 'HTML'},
  )
  return ctx.replyWithInvoice(getInvoice(ctx.message.chat.id))
})


bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))


const setWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { body, query } = req

    if (query.setWebhook === 'true') {
      const webhookUrl = `${BASE_PATH}/api/bot/webhook`

      const isSet = await bot.telegram.setWebhook(webhookUrl)
      console.log(`Set webhook to ${webhookUrl}: ${isSet}`)
    }

    await bot.handleUpdate(body)

    res.status(200).send('OK')
  } catch (error) {
    console.error('Error sending message')
    console.log((error as Error).toString())
    res.status(200).send("OK")
  }
}

export default setWebhook;
