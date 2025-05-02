import { useRef } from 'react';

const ChatForm = ({chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    // Clear the input field after submission
    inputRef.current.value = '';

    // update chat history with the user's message
    setChatHistory(history => [
      ...history,
      { role: 'user', text: userMessage }]);

    // Delay 600ms before showing "thinking..." message and generating the bot's response
    setTimeout(() =>
      
   // Add a "thinking..."  placeholder for the Bot's response 
    setChatHistory(history => [
    ...history,
    { role: 'model', text: "Thinking...." }]),

    // Call the function to generate the bot's response  
    generateBotResponse([...chatHistory, { role: 'user', text: `Using the details provided above,please address this query: ${userMessage}` }]),    
     600);
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef} // Correctly assign the ref here
        type="text"
        placeholder="Message....."
        className="message-input"
        required
      />
      <button className="material-symbols-rounded">arrow_upward</button>
    </form>
  );
};

export default ChatForm;