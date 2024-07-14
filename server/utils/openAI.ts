import OpenAI from "openai";

let openAi = null;
const getOpenAI = () => {
    if (!openAi) {
        openAi = new OpenAI({
            organization: process.env.OPEN_AI_ORG,
            apiKey: process.env.OPEN_AI_KEY,
            project: process.env.OPEN_AI_PROJECT,
        });
    }

    return openAi;
}
export default getOpenAI;