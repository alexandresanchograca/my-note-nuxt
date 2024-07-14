import getOpenAI from "~/server/utils/openAI";
import {useRequestBody} from "nitropack/runtime/utils";

export default defineEventHandler(async (event) => {
    const openai = getOpenAI();
    const body = await readBody(event);

    const auth = true;

    console.log("request body: ", body);

    try {
        if (!auth) {
            throw new Error(
                "The function must be called while authenticated."
            );
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: body?.messages || [],
            temperature: 0.8,
        });

        return completion;
    } catch (err) {
        console.log(err.message);
        return err;
    }
});
