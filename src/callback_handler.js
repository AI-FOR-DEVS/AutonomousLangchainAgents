import { BaseCallbackHandler } from 'langchain/callbacks'

export class MyCallbackHandler extends BaseCallbackHandler {
  name = 'MyCallbackHandler'

  async handleChainStart(chain) {
    console.log(`Started ${chain.id} chain.`)
  }

  async handleChainEnd(_output) {
    console.log('Chain execution complete.')
  }

  async handleAgentAction(action) {
    console.log(`Agent performed action: ${action.tool}`)
  }

  async handleToolEnd(output) {
    console.log(
      `Tool execution complete with result: ${
        output?.result?.summary || 'No summary available'
      }.`,
    )
  }

  async handleText(text) {
    console.log(`Received text: ${text.substring(0, 50)}...`) // Shortened for summary
  }

  async handleAgentEnd(action) {
    console.log(`Agent action complete.`)
  }
}
