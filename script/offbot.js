module.exports.config = {
  name: "offbot",
  version: "1.0.0",
  role: 1, // Assuming role 1 is admin
  hasPrefix: true,
  description: "Shuts down the bot.",
  usages: "offbot",
  credits: "Juno",
};

module.exports.run = async function({ api, event, roles }) {
  const command = event.body.trim();

  if (command.toLowerCase() === "offbot") {
    // Check if the sender's role allows them to use this command
    if (roles[event.senderID] && roles[event.senderID] === 1) { // Assuming role 1 is admin
      api.sendMessage("Shutting down the bot. Goodbye!", event.threadID, () => {
        process.exit(0); // This will terminate the bot process
      });
    } else {
      api.sendMessage("You do not have permission to shut down the bot.", event.threadID);
    }
  }
};
