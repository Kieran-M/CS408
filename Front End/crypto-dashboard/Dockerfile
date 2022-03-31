FROM node:16.14.2
WORKDIR /app
#Copy over depency list
COPY package.json .
#Install dependencies
RUN npm install
#Copy everything into /app dir
COPY . .   
EXPOSE 3000 
CMD ["npm", "start"]