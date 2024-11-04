const cron = require('node-cron');
const axios = require('axios');

module.exports.config = {
    name: "autopost-catfact",
    version: "1.0.0",
    credits: "Juno",  // Updated credits
};

module.exports.handleEvent = async function({ api }) {
    api.setOptions({
        selfListen: false, 
    });

    startAutoPost(api);
};

function startAutoPost(api) {
    cron.schedule("0,30 * * * *", async function () {  // Scheduled to run every 30 minutes
        try {
            const response = await axios.get("https://catfact.ninja/fact");
            const catFact = response.data.fact;

            const message = `RANDOM CAT FACT:\n${catFact}`;

            const formData = {
                input: {
                    composer_entry_point: "inline_composer",
                    composer_source_surface: "timeline",
                    idempotence_token: `${Date.now()}_FEED`,
                    source: "WWW",
                    message: {
                        text: message,
                    },
                    audience: {
                        privacy: {
                            base_state: "EVERYONE",
                        },
                    },
                    actor_id: api.getCurrentUserID(),
                },
            };

            const postResult = await api.httpPost(
                "https://www.facebook.com/api/graphql/",
                {
                    av: api.getCurrentUserID(),
                    fb_api_req_friendly_name: "ComposerStoryCreateMutation",
                    fb_api_caller_class: "RelayModern",
                    doc_id: "7711610262190099",
                    variables: JSON.stringify(formData),
                }
            );

            const postID = postResult.data.story_create.story.legacy_story_hideable_id;
            const postLink = `https://www.facebook.com/${api.getCurrentUserID()}/posts/${postID}`;

            api.sendMessage(`[AUTO POST]\nLink: ${postLink}`, /* Specify the thread ID or recipient here */);
            console.log(`[AUTO POST]\nLink: ${postLink}`);

        } catch (error) {
            console.error("Error during auto-posting:", error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Manila",
    });
}
