import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/inServer';

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  let body = null;

  // data is loading
  if (fetching) {
    // body =
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link color='white' mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href='/register'>
          <Link color='white'>Register</Link>
        </NextLink>
      </>
    );

    // user is logged in
  } else {
    body = (
      <Flex mr={2} color='white'>
        <Box>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout();
          }}
          variant='link'
          isLoading={logoutFetching}
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg='tomato' padding={4} ml={'auto'}>
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  );
};

export default NavBar;
