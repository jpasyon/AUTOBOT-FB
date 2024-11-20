module.exports.config = {
    name: "element",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno",
    description: "Get information about an element",
    usePrefix: false,
    commandCategory: "study",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    try {
        const axios = require('axios');
        const { threadID, messageID } = event;
        const prompt = args.join(" ");

        // List of elements in the periodic table
        const periodicElements = [
            "Hydrogen", "Helium", "Lithium", "Beryllium", "Boron", "Carbon", "Nitrogen", "Oxygen", "Fluorine", "Neon",
            "Sodium", "Magnesium", "Aluminum", "Silicon", "Phosphorus", "Sulfur", "Chlorine", "Argon", "Potassium", "Calcium",
            "Scandium", "Titanium", "Vanadium", "Chromium", "Manganese", "Iron", "Cobalt", "Nickel", "Copper", "Zinc",
            "Gallium", "Germanium", "Arsenic", "Selenium", "Bromine", "Krypton", "Rubidium", "Strontium", "Yttrium", "Zirconium",
            "Niobium", "Molybdenum", "Technetium", "Ruthenium", "Rhodium", "Palladium", "Silver", "Cadmium", "Indium", "Tin",
            "Antimony", "Tellurium", "Iodine", "Xenon", "Cesium", "Barium", "Lanthanum", "Cerium", "Praseodymium", "Neodymium",
            "Promethium", "Samarium", "Europium", "Gadolinium", "Terbium", "Dysprosium", "Holmium", "Erbium", "Thulium", "Ytterbium",
            "Lutetium", "Hafnium", "Tantalum", "Tungsten", "Rhenium", "Osmium", "Iridium", "Platinum", "Gold", "Mercury",
            "Thallium", "Lead", "Bismuth", "Polonium", "Astatine", "Radon", "Francium", "Radium", "Actinium", "Thorium",
            "Protactinium", "Uranium", "Neptunium", "Plutonium", "Americium", "Curium", "Berkelium", "Californium", "Einsteinium",
            "Fermium", "Mendelevium", "Nobelium", "Lawrencium", "Rutherfordium", "Dubnium", "Seaborgium", "Bohrium", "Hassium",
            "Meitnerium", "Darmstadtium", "Roentgenium", "Copernicium", "Nihonium", "Flerovium", "Moscovium", "Livermorium", "Tennessine", "Oganesson"
        ];

        if (!prompt.trim()) {
            return api.sendMessage("Please specify an element name. Example: element hydrogen", threadID, messageID);
        }

        // Normalize the user input and search for the element
        const searchTerm = prompt.toLowerCase();
        const matchedElement = periodicElements.filter(element =>
            element.toLowerCase().includes(searchTerm)
        );

        // If no match is found, suggest a list of elements
        if (matchedElement.length === 0) {
            return api.sendMessage(
                `No element found. Did you mean one of the following?\n${periodicElements.join(", ")}`,
                threadID,
                messageID
            );
        }

        // If the element is found, fetch detailed information using the API
        const elementName = matchedElement[0];
        const res = await axios.get(`https://api.popcat.xyz/periodic-table?element=${encodeURIComponent(elementName)}`);
        const data = res.data;
        const latinName = data.name_lat || data.name;

        const elementInfo = `
Information about ${data.name}:

Name: ${data.name}
Latin Name: ${latinName}
Symbol: ${data.symbol}
Atomic Number: ${data.atomic_number}
Atomic Mass: ${data.atomic_mass}
Period: ${data.period}
Phase: ${data.phase}
Discovered By: ${data.discovered_by}
Summary: ${data.summary}
        `.trim();

        return api.sendMessage(elementInfo, threadID, messageID);

    } catch (error) {
        console.error(error);
        return api.sendMessage(
            "Unable to fetch data for the specified element. Please ensure the name is spelled correctly.",
            event.threadID,
            event.messageID
        );
    }
};
