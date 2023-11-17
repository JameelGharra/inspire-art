const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    BlobSASPermissions,
    generateBlobSASQueryParameters,
} = require("@azure/storage-blob")

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
// connecting to the images container
async function generateSASToken() {
    const containerClient = blobServiceClient
    .getContainerClient(containerName)
    // generating permissions
    const permissions = new BlobSASPermissions()
    permissions.write = true
    permissions.create = true
    permissions.read = true
    // making the token valid for 30 minutes
    const expiryDate = new Date()
    expiryDate.setMinutes(expiryDate.getMinutes() + 30)

    const sasToken = generateBlobSASQueryParameters(
        {
            containerName: containerClient.containerName,
            permissions: permissions.toString(),
            expiresOn: expiryDate,
        },
        sharedKeyCredential,
    ).toString()
    return sasToken
}

module.exports = generateSASToken