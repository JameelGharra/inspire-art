import OpenAIApi from "openai"

const openai = new OpenAIApi({
    organization: process.env.OPENAI_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY
})

export default openai