const {
  PromptTemplate
} = require("langchain/prompts");
const {
  RunnableSequence
} = require("langchain/schema/runnable");
const {
  StringOutputParser
} = require("langchain/schema/output_parser");
const {
  formatDocumentsAsString
} = require("langchain/util/document");
const {
  RetrievalQAChain
} = require("langchain/chains")
const {
  AzureCosmosDBVectorStore
} = require("@langchain/community/vectorstores/azure_cosmosdb");
const {
  MongoClient
} = require("mongodb");

const MarkdownIt = require("markdown-it");
const markdown = new MarkdownIt();
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_CONNECTION_URL);
const namespace = process.env.MONGO_NAMESPACE;
const [dbName] = namespace.split(".");

(async function () {
  await client.connect();
  console.log("Connected successfully to Cosmos DB");
})();

// -- Models --

const {
  AzureOpenAIEmbeddings
} = require("@langchain/openai");
const {
  AzureOpenAI
} = require("openai")

const embeddings = new AzureOpenAIEmbeddings({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_STUDIO_API_KEY,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_STUDIO_API_VERSION,
  azureOpenAIApiEmbeddingsDeploymentName: "text-embedding-ada-002",
  endpoint: process.env.AZURE_OPENAI_STUDIO_API_ENDPOINT,
  model: "text-embedding-ada-002",
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_STUDIO_API_INSTANCE_NAME
})

const model = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
  endpoint: process.env.AZURE_OPENAI_API_ENDPOINT
})
// -- Models --

const db = client.db(dbName);
const collection = db.collection("documents");
const vectorstore = new AzureCosmosDBVectorStore(embeddings, {
  collection,
  indexName: "vectorSearchIndex",
  client,
  connectionString: process.env.MONGO_CONNECTION_URL,
  databaseName: "projectx",
  embeddingKey: "embedding",
  textKey: "text",
  collectionName: "documents"
});

const questionPrompt =
  `
  You are an helpful assistant.
  You are a highly intelligent Q & A bot which can provide *short and crisp* to the point answers to any question based on a given context.
  Use the provided pieces of context to answer the question at the end. 
  Strictly Adhere to the below given guidelines.
  Guidelines: Use the context provided as a reference and provide a crisp and short to the point answer to the question provided below. 
              Do not just provide the context as the answer, transform it using your intelligence.
              Strictly Answer to the question which is included below. 
              If the answer is deviating from the question then regenerate the answer until you arrive at the right answer.
              If the provided context is insufficient to answer the question then use your pretrained knowledge to generate an answer to the user's question.
              IMPORTANT: Headings begin from level 3 (h3).
                         Avoid the un-necessary use of bold.
                         Return the rich markdown file directly without backticks.
  `

async function retrieveSimilarDocs(query, user, course) {
  let docs = await vectorstore.similaritySearchWithScore(query, 5)
  return docs.map(doc => {
    return {
      content: doc[0].pageContent,
      user: doc[0].metadata.user,
      course: doc[0].metadata.course,
      score: doc[1]
    }
  }).filter((d) =>
    !course ?
    d.user === user :
    d.user == user && d.course === course
  );
}

function serializeDocs(docs) {
  /* return (docs && docs.length > 0) ? docs.map((doc, i) => {
    return `
    ${i}) ${doc.content}
    `
  }).join("\n") : ""; */
  return formatDocumentsAsString(docs)
}

async function generate_response(question, course, user, context) {
  console.log("User:", user);
  console.log("Q: " + question);
  let docs, serialized;

  if (!context)
    docs = await retrieveSimilarDocs(question, user, course);

  serialized = context || serializeDocs(docs);

  console.log("Context: \n" + serialized)
  let response = await model.chat.completions.create({
    messages: [{
        "role": "system",
        "content": questionPrompt
      },
      {
        "role": "user",
        "content": `CONTEXT: 
                    ${serialized}
                    ----------------
                  `
      },
      {
        "role": "user",
        "content": `QUESTION: ${question}
                    ----------------
                    Helpful Answer:
                  `
      }
    ],
    model: "gpt-4-32k",
    temperature: 0.7,
    response_format: {
      type: "text"
    }
  })

  let md = response.choices[0].message.content;
  return markdown.render(md);
};


module.exports = generate_response;