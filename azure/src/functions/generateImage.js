const { app } = require("@azure/functions");
const openai = require("../../lib/openai");
const axios = require("axios");
const generateSASToken = require("../../lib/generateSASToken");
const { BlobServiceClient } = require("@azure/storage-blob");
const accountName = process.env.ACCOUNT_STORAGE_NAME;

const containerName = "images";

app.http(
    'generateImage',
    {
        methods: ['POST'],
        authLevel: 'anonymous',
        handler: async (request) => {
            const { prompt } = await request.json()
            console.log(`Prompt is ${prompt}`)
            
            const response = await openai.images.generate({
                prompt: prompt,
                n: 1, // one image
                size: '1024x1024',
                model: "dall-e-2"
            })
            // downloading the image
            const imageURL = response.data[0].url
            const res = await axios.get(imageURL, { responseType: 'arraybuffer' })
            const arrayBuffer = res.data
            const generatedToken = await generateSASToken()
            const blobServiceClient = new BlobServiceClient(
                `https://${accountName}.blob.core.windows.net?${generatedToken}`
            )
            const containerClient = blobServiceClient.getContainerClient(containerName)
            
            // generating current timestamp
            const timestamp = new Date().getTime()
            const fileName = `${prompt}_${timestamp}.png`
            
            const blockBlobClient = containerClient.getBlockBlobClient(fileName)
            try {
                await blockBlobClient.uploadData(arrayBuffer)
                console.log("File uploaded successfully!")
            }
            catch(error) {
                console.error("Error uploading file: ", error.message)
            }
            return { body: "Successfully uploaded image" }
        }
    }
)