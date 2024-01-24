const Discord = module.require("discord.js");
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("dm")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .setDescription("Sends a dm to anyone")
  .addUserOption((option) =>
      option.setName("user").setRequired(true).setDescription("user to dm")
    )
  .addStringOption((option) =>
      option
        .setName("text")
        .setRequired(true)
        .setDescription("the text to dm")
    ),
  async execute(interaction) {
      const user = interaction.options.getUser("user")
      const text = interaction.options.getString("text")

      
      
    if (!user) {let Embed172 = new EmbedBuilder()
        .setDescription("Please mention a **Valid** user.")
        .setTitle("**Error - Impossible Action**")
        .setColor("#FF073A")
        return interaction.reply({ embeds: [Embed172] })}

        
    

    if (!text){let Embed172 = new EmbedBuilder()
        .setDescription("Please enter a **Message**.")
        .setTitle("**Error - Impossible Action**")
        .setColor("#FBD570")
        return interaction.reply({ embeds: [Embed172] })}

       
      
   
   
     
    
      let embed = new EmbedBuilder()
      .setTitle("**Dear User**")
      .setDescription(`${text}`)
      .setColor("#FBD570")
      .setTimestamp()
      user.send({ embeds: [embed] })

      let embed98 = new EmbedBuilder()
      .setTitle("**Message Sent**")
      .setDescription(`${text}`)
      .setColor("#00ff00")
      .setTimestamp()
      interaction.reply({ embeds: [embed98] })

  },

  
};