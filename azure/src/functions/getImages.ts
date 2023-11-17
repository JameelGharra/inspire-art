import { 
    BlobServiceClient, 
    StorageSharedKeyCredential, 
} 
from "@azure/storage-blob"

import { FunctionResult, HttpRequest, HttpResponse, HttpResponseInit, InvocationContext, app } from "@azure/functions"

const generateSASToken = require("../../lib/generateSASToken")
const accountName = process.env.ACCOUNT_STORAGE_NAME
const accountKey = process.env.ACCOUNT_STORAGE_KEY
const containerName = "images"

const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
)
const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
)

app.http(
    "getImages",
    {
        methods: ["GET"],
        authLevel: "anonymous",
        handler: async (request, context) => {
            const containerClient = blobServiceClient
            .getContainerClient(containerName)
            const imageUrls = []
            const sasToken = await generateSASToken()
            for await (const blob of containerClient.listBlobsFlat()) {
                const imageUrl = `${blob.name}?${sasToken}`;
                const url = `https://${accountName}.blob.core.windows.net/images/${imageUrl}`;
                imageUrls.push({url, name: blob.name})
            }
            const sortedImageUrls = imageUrls.sort((a, b) => {
                // for e.g. "draw-a-dinosaur_1241231246.png", we will return 1241231246
                const aName = a.name.split("_").pop().toString().split(".").shift()
                const bName = b.name.split("_").pop().toString().split(".").shift()
                return bName - aName
            })
            context.log(`Http function processed request for url "${request.url}"`)
            return {
                jsonBody: {
                    imageUrls: sortedImageUrls
                }
            }
        }
    }
)