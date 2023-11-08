import { Box, styled, Divider } from '@mui/material';
import React, { useEffect, useState, useContext } from 'react';
import { getUsers } from '../../../service/api';
import { AccountContext } from '../../../context/AccountProvider';
import Conversation from './Conversation';

const Component = styled(Box)`
  height: 81vh;
  overflow: overlay;
`;

const StyledDivider = styled(Divider)`
  margin: 0 0 0 70px;
  background: #e9edef;
  opacity: 0.6;
`;
const Conversations = ({ text }) => {
  const { account, socket, activeUsers, setActiveUsers } =
    useContext(AccountContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let response = await getUsers();
      const filterData = response.filter((user) =>
        user.name.toLowerCase().includes(text.toLowerCase())
      );
      setUsers(filterData);
    };
    fetchData();
  }, [text]);

  useEffect(() => {
    socket.current.emit('addUsers', account);
    socket.current.on('getUsers', (users) => {
      setActiveUsers(users);
    });
  }, [account]);
  return (
    <Component>
      {users.map((user, index) => {
        return (
          user.sub !== account.sub && (
            <div key={index}>
              <Conversation  user={user} />
              <StyledDivider />
            </div>
          )
        );
      })}
    </Component>
  );
};

export default Conversations;
