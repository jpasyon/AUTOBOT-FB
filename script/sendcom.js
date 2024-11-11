const axios = require('axios');

module.exports.config = {
    name: 'sendcom',
    usedby: 4,
    info: 'Send a comment on a post using the bot',
    onPrefix: true,
    dev: 'Jonell Magallanes',
    cooldowns: 5,
    description: 'Send a comment to a Facebook post',
    usage: 'sendcom [URL] [comment]',
};

module.exports.run = async function({ api, event, target }) {
    const prompt = target.join(' ');

    if (!prompt) {
        return api.sendMessage('Usage: sendcom [URL] [comment]', event.threadID, event.messageID);
    }

    const sending = await api.sendMessage('Sending Comment......', event.threadID, event.messageID);
    const url = target[0];
    const comment = target.slice(1).join(' ');

    const regexPfbid = /pfbid\w+/;
    const regexPostSegment = /\/posts\/(\w+)/;
    const regexGroupID = /\/groups\/[^/]+\/permalink\/(\d+)/;

    let postID = url.match(regexPfbid);

    if (!postID) {
        let match = url.match(regexPostSegment);
        if (!match) {
            match = url.match(regexGroupID);
        }
        postID = match ? match[1] : null;
    } else {
        postID = postID[0];
    }

    api.editMessage('Extracting URL into Post ID', sending.messageID, event.threadID, event.messageID);

    if (!postID) {
        return api.editMessage(
            'Invalid URL. Please provide a valid Facebook post URL.',
            sending.messageID,
            event.threadID,
            event.messageID
        );
    }

    try {
        await api.sendComment(comment, postID);
        api.editMessage(
            `Comment successfully sent.`,
            sending.messageID,
            event.threadID,
            event.messageID
        );
    } catch (error) {
        api.editMessage(error.message, sending.messageID, event.threadID, event.messageID);
    }
};
