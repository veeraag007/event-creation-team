FROM node:22-alpine
WORKDIR /repo
COPY package.json package-lock.json* ./
COPY apps ./apps
COPY packages ./packages
COPY services ./services
RUN npm install
ENV PORT=4000 DATA_DIR=/data
VOLUME /data
EXPOSE 4000
CMD ["npm", "run", "start", "-w", "@community/api"]
