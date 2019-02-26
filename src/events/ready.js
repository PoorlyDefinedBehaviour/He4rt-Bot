const util = require('../util');
const Discord = require('discord.js')

module.exports = async (client, message) => {
  client.user.setPresence({
    status: 'online',
    game: {
      name: 'a qualidade que você procura 💻 | heartdevs.com',
      type: 'STREAMING',
      url: 'https://www.twitch.tv/danielhe4rt',
    },
  });

  // polling do tempban
  const guild = client.guilds.get(process.env.GUILD_ID);
  setInterval(() => {
    client.rest.methods
      .getGuildBans(guild)
      .then(bans =>
        bans.forEach(ban => {
          // timestanp do cara banido
          const timeStampBanido = ban.reason
            .toString()
            .split(' ')[0]
            .replace('[', '')
            .replace(']', '');

          // Se o timestanp do cara banido for maior que o atual
          if (Date.now() > timeStampBanido) {
            guild
              .unban(ban.user.id)
              .then(() =>
                console.log(`Usuario desbanido (tempban): ${ban.user.id}`)
              )
              .catch(console.error);
          }
        })
      )
      .catch(console.erro);
  }, 60000); // verifica a cada 1mim


  //Sistema para ficar editando a msg de status
  setInterval(() => {
    const randomId = Math.floor((Math.random() * 12) + 1);

    //Pegar a curiosidade no db e mandar o embed
    client.db.get(`SELECT * FROM curiosidades WHERE id='${randomId}'`, (err, result) => {
      if(err) console.error
      else {
        const ping = Math.round(client.ping);
        const members = guild.members.size;
    

        let numeroMembrosApresentados = 0;
        let lista  = guild.members;
        lista.forEach(m => {
          if(m.roles.has(process.env.APRESENTOU_ROLE)) numeroMembrosApresentados++;
        })

        const embed = new Discord.RichEmbed()
          .setTitle('``⏰`` Página de Status')
          .addField('``💡`` **Curiosidade:**', `${result.text}`)
          .addField('``👥`` **Usuários:**', `${members}`, true)
          .addField('``🎓`` **Usuários apresentados:**', `${numeroMembrosApresentados}`, true) 
          .addField('``📡`` **Letência da API:**', `${ping}ms`, true) 
          .setFooter('Última atualização:')
          .setTimestamp();

        client.channels.get('546143129749815306').bulkDelete(1)
        client.channels.get('546143129749815306').send(embed)
      }
    });
  }, 10000);
};
