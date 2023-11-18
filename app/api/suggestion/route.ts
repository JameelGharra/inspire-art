export async function GET(request: Request) {
    // connecting to Azure functions endpoint
    const response = await fetch('https://openai-image-generator.azurewebsites.net/api/getchatgptsuggestion', {
        cache: 'no-store'
    })
    const textData = await response.text()
    return new Response(JSON.stringify(textData.trim()), {
        status: 200,
    })
}