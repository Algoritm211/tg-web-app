import {Telegraf} from 'telegraf'

console.log(process.env.BOT_TOKEN)

export const bot = new Telegraf(process.env.BOT_TOKEN!)
