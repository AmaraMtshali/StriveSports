module.exports = {
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  testEnvironment: 'jsdom',
  silent: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
       "^.+\\.mjs$": "babel-jest"
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(\\@fullcalendar)/)',
    '/node_modules/(?!preact).+\\.js$',
    "/node_modules/(?!@clerk/)"
  ],
};