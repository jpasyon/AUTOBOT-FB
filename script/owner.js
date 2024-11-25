
const { OnChat } = require('chatbox-utility');

module.exports["config"] = {
    name: "owner",
    aliases: ["owner"],
    isPrefix: false,
    info: "Owners Information",
    credits: "Juno",
    cd: 5
};

module.exports["run"] = async ({ api, event }) => {
    const chat = new OnChat(api, event);

    if (!event.isGroup) return chat.reply("Response:");

    const response = "Response:\n" +
        "BOT NAME: Unknown\n" +
        "BOT OWNER: Jesus Dolores Castañeda.\n" +
        "HOBBY: Sleeping, Cooking\n" +
        "STATUS: Single\n" +
        "AGE: 21\n" +
        "SPORTS: Basketball\n" +
        "LOCATION: Philippines\n" +
        "OWNERS LINK: https://www.facebook.com/profile.php?id=100093705110825\n";

    chat.reply(response);
};
