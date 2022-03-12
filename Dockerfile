FROM node:14

COPY package.json .

RUN npm install --global --force yarn
RUN yarn install --frozen-lockfile
COPY . .
CMD ["yarn", "start"]