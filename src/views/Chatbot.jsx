import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const websocket = new WebSocket(import.meta.env.VITE_WS_URL);
    
    websocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(websocket);

    // Cleanup on component unmount
    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = async (message) => {
    try {
      // Send message via HTTP
      const response = await axiosInstance.post('/chat', { message });
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Your chatbot UI components */}
    </div>
  );
};

export default Chatbot; 