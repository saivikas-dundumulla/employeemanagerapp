# Stage 1: compile and build angular codebase

# use official node image as build image
FROM node:18.18.2 as build
# set the working directory
WORKDIR /usr/local/app
# copy package.json & package-lock.json files into the docker image
COPY package*.json .
# install packages
RUN npm install
# copy the code base
COPY . .
# generate the build of application
RUN npm run build

# Stage 2:  serve app with nginx server
FROM nginx:latest
# copy the build output to replace the default nginx context
COPY --from=build /usr/local/app/dist/employeemanagerapp /usr/share/nginx/html
# Expose port 80
EXPOSE 80

