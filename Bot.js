const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')

const stepHandler = new Composer()

class Bot {
    constructor(BOT_TOKEN) {

        // const stepHandler = new Composer()
        // stepHandler.action('next', (ctx) => {
        //   ctx.reply('Step 2. Via inline button')
        //   return ctx.wizard.next()
        // })
        // stepHandler.command('next', (ctx) => {
        //   ctx.reply('Step 2. Via command')
        //   return ctx.wizard.next()
        // })
        // stepHandler.use((ctx) => ctx.replyWithMarkdown('Press `Next` button or type /next'))
        
        // const superWizard = new WizardScene('super-wizard',
        //   (ctx) => {
        //     ctx.reply('Step 1', Markup.inlineKeyboard([
        //       Markup.urlButton('❤️', 'http://telegraf.js.org'),
        //       Markup.callbackButton('➡️ Next', 'next')
        //     ]).extra())
        //     return ctx.wizard.next()
        //   },
        //   stepHandler,
        //   (ctx) => {
        //     ctx.update.message //
        //     ctx.reply('Step 3')
        //     return ctx.wizard.next()
        //   },
        //   (ctx) => {
        //     ctx.reply('Step 4')
        //     return ctx.wizard.next()
        //   },
        //   (ctx) => {
        //     ctx.reply('Done')
        //     return ctx.scene.leave()
        //   }
        // )
        
        // const bot = new Telegraf(BOT_TOKEN)
        // const stage = new Stage([superWizard], { default: 'super-wizard' })
        // bot.use(session())
        // bot.use(stage.middleware())
        // bot.startPolling()
        

        this.subscription = {
        } 
        this.bot = new Telegraf(BOT_TOKEN);       
        this.bot.start((ctx) => {
          console.log('started:', ctx.from.id)
          return ctx.reply('Welcome!')
        });
        this.bot.command('help', (ctx) => ctx.reply(`
        ***** Manual *****
        Create new subscription: New #NAME
        Subscribe channel: Subscribe #NAME
        `))
        this.bot.hears('hi', (ctx) => ctx.reply('Hey there!'))
        this.bot.hears(/Test (.+)/, (ctx) => {
            const name = ctx.match[1];
            if (this.subscription.name) {
                ctx.reply('There is already a Subscribe with the name ' + name)
            } else {
                ctx.reply('Pleas enter website Url');
                this.generateSubscription(name)
            }
        })
        this.bot.startPolling();    
    }

    generateSubscription(name) {
        const wizard = new WizardScene('new-subscription',
            (ctx) => {
                const url = ctx.update.message;
                return ctx.wizard.next()
            },
            (ctx) => {
                ctx.reply('Step 3')
                return ctx.wizard.next()
            })
        const stage = new Stage([wizard], { default: 'new-subscription' })
        this.bot.use(session())
        this.bot.use(stage.middleware());
        this.bot.startPolling()
    }
}

module.exports = Bot;