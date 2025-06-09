# DeltaBuddyBot: Automated receipt message script
# Requires: python-telegram-bot library

# Install this first:
# pip install python-telegram-bot==13.15

from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext

# Your Telegram Bot Token (replace with your real token from @BotFather)
TELEGRAM_BOT_TOKEN = '7952414630:AAFzcmSJhrC6SmPEVD3xa_7W5sBEmaxTGoE'

# /start command handler
def start(update: Update, context: CallbackContext):
    user_firstname = update.effective_user.first_name or 'Trader'
    welcome_message = f"✅ Welcome {user_firstname} to DeltaBuddy!\n\nYou are now connected ✅\nYou will receive alerts and updates here.\n\nHappy Trading! 🚀"
    update.message.reply_text(welcome_message)

def main():
    updater = Updater(token=TELEGRAM_BOT_TOKEN, use_context=True)
    dispatcher = updater.dispatcher

    # Add /start command handler
    dispatcher.add_handler(CommandHandler('start', start))

    # Start the bot
    print("DeltaBuddy Bot is running... Press Ctrl+C to stop.")
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
