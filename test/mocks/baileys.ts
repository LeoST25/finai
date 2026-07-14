const socketMock = {
  ev: {
    on: jest.fn(),
  },
  sendMessage: jest.fn(),
};

const makeWASocket = jest.fn(() => socketMock);

export const DisconnectReason = {
  loggedOut: 401,
};

export const useMultiFileAuthState = jest.fn(() =>
  Promise.resolve({
    state: {
      creds: {},
      keys: {},
    },
    saveCreds: jest.fn(() => Promise.resolve()),
  }),
);

export default makeWASocket;
