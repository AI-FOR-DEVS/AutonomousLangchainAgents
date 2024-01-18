import axios from 'axios'
import { Tool } from 'langchain/tools'

const serper_api_key = process.env.SERPER_API_KEY

export async function search(query) {
  const url = 'https://google.serper.dev/search'

  const headers = {
    'X-API-KEY': serper_api_key,
    'Content-Type': 'application/json',
  }

  try {
    const response = await axios.post(url, { q: query }, { headers: headers })
    return response.data
  } catch (error) {
    console.error('Error making the request:', error)
    throw error
  }
}

// Define the Tool subclass
export class SearchTool extends Tool {
  // Define the abstract properties
  name = 'Search'
  description = 'A tool to search the web using the SERPer API.'

  // Implement the _call method
  async _call(arg) {
    try {
      const result = await search(arg)
      return JSON.stringify(result) // Convert the result to a string, you can format this as needed
    } catch (error) {
      return `Error: ${error.message}` // Return error as string
    }
  }
}
