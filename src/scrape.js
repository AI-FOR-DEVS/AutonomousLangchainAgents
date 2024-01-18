import axios from 'axios'
import { JSDOM } from 'jsdom'
import { summary } from './summary.js'
import { Tool } from 'langchain/tools'

const browserless_api_key = process.env.BROWSERLESS_API_KEY

export async function scrapeWebsite(url) {
  const headers = {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  }

  const data = { url: url }
  const postUrl = `https://chrome.browserless.io/content?token=${browserless_api_key}`

  try {
    const response = await axios.post(postUrl, data, { headers: headers })

    const dom = new JSDOM(response.data)
    const text = dom.window.document.documentElement.textContent

    if (text.length > 10000) {
      text = await summary(text)
    }

    return text
  } catch (error) {
    console.log(`HTTP request failed with status code ${error.response.status}`)
  }
}

// Define the Tool subclass
export class ScrapeWebsiteTool extends Tool {
  // Define the abstract properties
  name = 'ScrapeWebsite'
  description =
    'A tool to scrape content from a website using browserless.io API.'

  // Implement the _call method
  async _call(arg) {
    try {
      const result = await scrapeWebsite(arg)
      return result
    } catch (error) {
      return `Error: ${error.message}` // Return error as string
    }
  }
}
