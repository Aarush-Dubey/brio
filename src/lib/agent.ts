import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { END, MessagesValue, START, StateGraph, StateSchema } from "@langchain/langgraph";

const AgentState = new StateSchema({ messages: MessagesValue });

const respond: typeof AgentState.Node = async (state) => {
  if (!process.env.OPENAI_API_KEY) {
    return {
      messages: [
        new AIMessage("The graph is working. Add OPENAI_API_KEY to .env.local to connect the model."),
      ],
    };
  }

  const model = new ChatOpenAI({ model: "gpt-5-mini", temperature: 0 });
  const response = await model.invoke([
    new SystemMessage("You are a concise, helpful product assistant."),
    ...state.messages,
  ]);
  return { messages: [response] };
};

export const agentGraph = new StateGraph(AgentState)
  .addNode("respond", respond)
  .addEdge(START, "respond")
  .addEdge("respond", END)
  .compile();

export async function runAgent(message: string) {
  const result = await agentGraph.invoke({ messages: [new HumanMessage(message)] });
  const content = result.messages.at(-1)?.content;
  return typeof content === "string" ? content : JSON.stringify(content);
}
