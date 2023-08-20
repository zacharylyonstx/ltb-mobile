import React, { useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';

export const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

  const onSend = async (newMessages = []) => {
    setMessages(GiftedChat.append(messages, newMessages));

    try {
      const response = await axios.post('https://api.openai.com/v4/engines/davinci-codex/completions', {
        prompt: newMessages[0].text,
        max_tokens: 60,
      }, {
        headers: {
          'Authorization': `Bearer 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`,
        },
      });

      const botMessage = {
        _id: Math.random().toString(),
        text: response.data.choices[0].text,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'GPT-4',
        },
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, botMessage));
    } catch (error) {
      console.error(error);
      const errorMessage = {
        _id: Math.random().toString(),
        text: `An error occurred: ${error.message}`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Error',
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, errorMessage));
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={newMessages => onSend(newMessages)}
      user={{
        _id: 1,
      }}
    />
  );
};
