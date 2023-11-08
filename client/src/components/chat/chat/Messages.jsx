import { Box, styled } from '@mui/material';

import React, { useContext, useState, useEffect, useRef } from 'react';
import { AccountContext } from '../../../context/AccountProvider';
import { newMessage, getMessages } from '../../../service/api';
import Footer from './Footer';
import Message from './Message';
const Wrapper = styled(Box)`
  background-image: url(${'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'});
  background-size: 50%;
`;

const Component = styled(Box)`
  height: 80vh;
  overflow-y: scroll;
`;

const Container = styled(Box)`
  padding: 1px 80px;
`;
const Messages = ({ person, conversation }) => {
  const { account, socket, newMessageFlag, setNewMessageFlag } =
    useContext(AccountContext);

  const [value, setValue] = useState('');

  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState();
  const [image, setImage] = useState('');
  const scrollRef = useRef();
  const [incomingMessage, setIncomingMessage] = useState(null);

  useEffect(() => {
    socket.current.on('getMessage', (data) => {
      setIncomingMessage({
        ...data,
        createdAt: Date.now(),
      });
    });
  }, []);
  useEffect(() => {
    incomingMessage &&
      conversation?.members?.includes(incomingMessage.senderId) &&
      setMessages((prev) => [...prev, incomingMessage]);
  }, [incomingMessage, conversation]);
  useEffect(() => {
    const getMessageDetails = async () => {
      let data = await getMessages(conversation._id);
      setMessages(data);
    };
    conversation._id && getMessageDetails();
  }, [person, conversation._id, newMessageFlag]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ transition: 'smooth' });
  }, [messages]);

  const sentText = async (event) => {
    const code = event.keyCode || event.which;
    if (code === 13) {
      let message = {};
      if (!file) {
        message = {
          senderId: account.sub,
          recieverId: person.sub,
          conversationId: conversation._id,
          type: 'text',
          text: value,
        };
      } else {
        message = {
          senderId: account.sub,
          recieverId: person.sub,
          conversationId: conversation._id,
          type: 'file',
          text: image,
        };
      }
      socket.current.emit('sendMessage', message);
      await newMessage(message);
      setValue('');
      setFile('');
      setValue('');
      setNewMessageFlag((prev) => !prev);
    }
  };

  return (
    <Wrapper>
      <Component>
        {messages &&
          messages.map((message, index) => {
            return (
              <Container key={index} ref={scrollRef}>
                <Message message={message} />
              </Container>
            );
          })}
      </Component>
      <Footer
        sentText={sentText}
        setValue={setValue}
        value={value}
        file={file}
        setFile={setFile}
        setImage={setImage}
      />
    </Wrapper>
  );
};

export default Messages;
