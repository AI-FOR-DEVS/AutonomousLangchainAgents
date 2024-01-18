import { ChatOpenAI } from 'langchain/chat_models/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { RetrievalQAChain } from 'langchain/chains'

const llm = new ChatOpenAI({ modelName: 'gpt-3.5-turbo' })

export async function summary(data) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 5000,
    chunkOverlap: 1000,
  })

  const splitted = await textSplitter.createDocuments([data])

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitted,
    new OpenAIEmbeddings(),
  )

  const chain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever())

  const response = await chain.call({
    query:
      'Please summarize the content, focusing on the roles and significance of the persons mentioned by name.',
  })

  console.log('RESPONSE', response)
  return response
}
