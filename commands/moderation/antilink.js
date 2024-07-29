const fs = require("fs");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
 
// Function to read the antilinkConfig.json file
const readConfigFile = () => {
  try {
    const configFileContent = fs.readFileSync(`${process.cwd()}/antilinkConfig.json`, "utf8");
    return JSON.parse(configFileContent);
  } catch (error) {
    console.error("Error reading config file:", error);
    return null;
  }
};
 
// Function to write the antilinkConfig.json file
const writeConfigFile = (config) => {
  try {
    const data = JSON.stringify(config, null, 2); // Indent for readability
    fs.writeFileSync(`${process.cwd()}/antilinkConfig.json`, data);
    return true;
  } catch (error) {
    console.error("Error writing config file:", error);
    return false;
  }
};
 
// Function to format embed data
function formatEmbedData(title, data, guild) {
  if (!data || data.length === 0) {
    return { title: title, description: "No data available." };
  }
 
  // Helper function to get role name by ID
  const getRoleName = (roleId) => {
    const role = guild.roles.cache.get(roleId);
    return role ? role.name : "Unknown Role";
  };
 
  const formattedData = data.map((item) => {
    const roleMatch = item.match(/"(\d+)",\s*\/\/\s*([^]+)$/);
    if (roleMatch) {
      const roleId = roleMatch[1];
      const roleName = getRoleName(roleId);
      return `<@&${roleId}> - ${roleName}`;
    } else {
      return item;
    }
  });
 
  return { title: title, description: formattedData.join("\n") };
}
 
module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("antilink")
    .setDescription("Configure the antilink system!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("db")
        .setDescription("Enter the antilink Database")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("Select action to perform")
            .setRequired(true)
            .addChoices(
              { name: "Whitelisted Links", value: "whitelist_links" },
              { name: "Blacklisted Links", value: "blacklist_links" },
              { name: "Blacklisted Terms", value: "blacklist_terms" },
              { name: "Whitelisted Roles", value: "whitelist_roles" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("configure")
        .setDescription("Configure whitelist or blacklist.")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("Select action to perform")
            .setRequired(true)
            .addChoices(
              { name: "Whitelist", value: "whitelist" },
              { name: "Blacklist", value: "blacklist" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("operation")
            .setDescription("Select whether to add or remove")
            .setRequired(true)
            .addChoices(
              { name: "Add", value: "add" },
              { name: "Remove", value: "remove" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Select the type to configure")
            .setRequired(true)
            .addChoices(
              { name: "Link", value: "link" },
              { name: "Term", value: "term" },
              { name: "Role", value: "role" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("value")
            .setDescription("Enter the link URL or role ID")
            .setRequired(true)
        )
    ),
 
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
 
    if (subcommand === "db") {
      const action = interaction.options.getString("action");
 
      const config = readConfigFile();
 
      console.log("Config:", config);
 
      if (!config) {
        await interaction.reply({
          content: "Error reading config file.",
          ephemeral: true,
        });
        return;
      }
 
      let embedData;
 
      switch (action) {
        case "whitelist_links":
          embedData = formatEmbedData(
            "Whitelisted Links",
            config.whitelistedLinks,
            interaction.guild // Pass the guild object here
          );
          break;
        case "blacklist_links":
          embedData = formatEmbedData(
            "Blacklisted Links",
            config.blacklistedLinks,
            interaction.guild // Pass the guild object here
          );
          break;
        case "blacklist_terms":
          embedData = formatEmbedData(
            "Blacklisted Terms",
            config.blacklistedTerms,
            interaction.guild // Pass the guild object here
          );
          break;
        case "whitelist_roles":
          embedData = formatEmbedData(
            "Whitelisted Roles",
            config.whitelistedRoles,
            interaction.guild // Pass the guild object here
          );
          break;
        default:
          embedData = "Invalid action specified.";
          break;
      }
 
      const embed = new EmbedBuilder()
        .setTitle(embedData.title)
        .setDescription(embedData.description)
        .setColor("#0099ff");
 
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else if (subcommand === "configure") {
      const type = interaction.options.getString("type");
      const value = interaction.options.getString("value");
      const operation = interaction.options.getString("operation");
      const action = interaction.options.getString("action");
 
      const config = readConfigFile();
      let configKey;
      if (type === "link") {
        configKey = `${action}edLinks`;
      } else if (type === "term") {
        configKey = `${action}edTerms`;
      } else if (type === "role") {
        configKey = `${action}edRoles`;
        // Check if the specified role exists in the server
        const role = interaction.guild.roles.cache.find(
          (role) => role.id === value
        );
        if (!role) {
          await interaction.reply({
            content: "Invalid role specified.",
            ephemeral: true,
          });
          return;
        }
      }
 
      console.log("Config Key:", configKey);
 
      if (!config[configKey]) {
        await interaction.reply({
          content: "Invalid configuration key.",
          ephemeral: true,
        });
        return;
      }
 
      if (operation === "add") {
        if (!config[configKey].includes(value)) {
          config[configKey].push(value);
          const success = writeConfigFile(config);
          if (success) {
            await interaction.reply({
              content: `Successfully added ${type}: **${value}** to the ${action}ed list.`,
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: "Error writing config file.",
              ephemeral: true,
            });
          }
        } else {
          await interaction.reply({
            content: `${type}: **${value}** is already present in the ${action}ed list.`,
            ephemeral: true,
          });
        }
      } else if (operation === "remove") {
        const index = config[configKey].indexOf(value);
        if (index !== -1) {
          config[configKey].splice(index, 1);
          const success = writeConfigFile(config);
          if (success) {
            await interaction.reply({
              content: `Successfully removed ${type}: **${value}** from the ${action}ed list.`,
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: "Error writing config file.",
              ephemeral: true,
            });
          }
        } else {
          await interaction.reply({
            content: `${type}: **${value}** is not present in the ${action}ed list.`,
            ephemeral: true,
          });
        }
      }
    }
  },
};