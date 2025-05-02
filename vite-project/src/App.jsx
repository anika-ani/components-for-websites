import React, { useRef, useState  } from "react";
import ChatBotIcon from "./component/ChatBotIcon";
import ChatForm from "./component/ChatForm";
import ChatMessage from "./component/chatMessage"; 
import {companyInfo} from "./company info/companyInfo";

const App = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: 'model',
      text: companyInfo
    }
  ]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {

    // Helper function to update the chat history
    const updateHistory=(text, isError = false)=>{
      setChatHistory((prev) => [...prev.filter((msg)=> msg.text !== "Thinking...."),
         { role: 'model', text, isError  },
        ]);
        
      };         
     // Format the chat history for the API request
    history = history.map(({ role, text }) => ({role, parts: [{text}]}));

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: history })
    };

    try{
      // Make the API call to get the bot's response
      const response = await fetch (import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if(!response.ok) throw new Error(data.error.message || 'Something went wrong');

      // Clean and Update the chat history with the bot's response
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*\((.*?)\)\*\*/g,`$1`).trim();
        
        updateHistory(apiResponseText);
      }catch (error) {
        updateHistory(error.message, true);

      }
  };

  useRef(() =>{
    // auto-scroll whenever chat history updates
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior:'smooth'});
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? 'show-chatbot' : ''}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        id="chatbot-toggler"
      >
        {showChatbot ? (
          <span className="material-symbols-rounded">close</span>
        ) : (
          <span className="material-symbols-rounded">mode_comment</span>
        )}
      </button>
  
      {/* Chatbot Popup */}
      {showChatbot && (
        <div className="chatbot-popup">
          
          {/* Chatbot Header */}
          <div className="chat-header">
            <div className="header-info">
              <ChatBotIcon />
              <h2 className="logo-text">Chatbot</h2>
            </div>
            <button onClick={() => setShowChatbot(prev => !prev)} 
            className="material-symbols-rounded">keyboard_arrow_down</button>
          </div>
  
          {/* Chatbot Body */}
          <div ref={chatBodyRef} className="chat-body">
            {/* Hardcoded First Bot Message */}
            <div className="message bot-message">
              <ChatBotIcon />
              <p className="message-text">
                Hello!<br />
                How can I assist you today?
              </p>
            </div>
  
            {/* Render the chat history dynamically */}
            {(chatHistory || []).map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>
  
          {/* Chatbot Footer */}
          <div className="chat-footer">
            <ChatForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;