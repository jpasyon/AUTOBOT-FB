const { OnChat } = require('chatbox-utility');

module.exports["config"] = {
    name: "owners",
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
        "BOT NAME: Juno Delos Santos\n" +
        "BOT OWNER: Juno Delos Santos\n" +
        "HOBBY: Coding, Programming\n" +
        "STATUS: Single\n" +
        "AGE: 15\n" +
        "SPORTS: Badminton\n" +
        "LOCATION: Philippines\n" +
        "OWNERS LINK: https://www.facebook.com/profile.php?id=100091133423695\n";

    chat.reply(response);
};
