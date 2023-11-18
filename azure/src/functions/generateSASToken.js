const { app } = require("@azure/functions");
const generateSASToken = require("../../lib/generateSASToken");

apps.http('generateSASToken', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const sasToken = await generateSASToken()
        return { body: sasToken }
    },
});
