import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

const webhookWhatsAppUrl = `https://inkomini.app.n8n.cloud/webhook/message`;

const WhatsAppChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Soy el asistente de INKO. ¿En qué puedo ayudarte hoy?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage(""); // Limpiar el input inmediatamente
    setIsSending(true);

    try {
      // Aquí se enviaría a tu webhook de n8n
      const response = await fetch(`${webhookWhatsAppUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: Date.now().toString() + "_bot",
          text: data.message,
          isBot: true,
          timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Error al enviar mensaje');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString() + "_error",
        text: "Lo siento, no pude procesar tu mensaje. ¿Podrías repetirlo?",
        isBot: true,
        timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
      setInputMessage("");
    }
  };

  const scrollToBottom = () => {
    const messagesContainer = document.querySelector('.whatsapp-messages') as HTMLElement;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="whatsapp-chat">
      <div className="whatsapp-header">
        <div className="flex items-center space-x-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.251"/>
          </svg>
          <div>
            <h4 className="font-bold">Asistente INKO</h4>
            <p className="text-sm text-green-100">En línea</p>
          </div>
        </div>
      </div>
      <div className="whatsapp-messages" data-testid="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`whatsapp-message ${message.isBot ? 'bot' : 'user'}`}
          >
            <div
              className="message-bubble"
              data-testid={`message-${message.isBot ? 'bot' : 'user'}`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
            <p className="message-time">
              {message.timestamp}
            </p>
          </div>
        ))}
        {isSending && (
          <div className="whatsapp-message bot">
            <div className="message-bubble">
              <p className="text-sm text-gray-500">Escribiendo...</p>
            </div>
          </div>
        )}
      </div>
      <div className="whatsapp-input">
        <div className="flex space-x-2">
          <input
            type="text"
            className="input flex-1 text-sm"
            placeholder="Escribe tu mensaje..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            data-testid="input-whatsapp"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isSending}
            className="btn bg-green-500 hover:bg-green-600 text-white"
            data-testid="button-send-whatsapp"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChat;
