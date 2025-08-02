const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Command: /price
bot.command('price', async (ctx) => {
  const coin = ctx.message.text.split(' ')[1] || 'bitcoin';
  const price = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`)
    .then(res => res.json());
  ctx.reply(`💰 ${coin.toUpperCase()}: $${price[coin]?.usd || 'Tidak ditemukan'}`);
});

// Command: /analyze (Menggunakan Claude Opus 4)
bot.command('analyze', async (ctx) => {
  const coin = ctx.message.text.split(' ')[1] || 'BTC';
  const analysis = await fetch('https://api.puter.com/v1/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-opus-4',
      messages: [{
        role: 'user',
        content: `Berikan analisis trading ${coin} hari ini dengan RSI dan support/resistance. Gunakan format markdown.`
      }]
    })
  }).then(res => res.json());
  
  ctx.reply(analysis.message.content[0].text, { parse_mode: 'Markdown' });
});

bot.launch();
