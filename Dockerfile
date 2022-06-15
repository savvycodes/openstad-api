# Nodejs 8.0.0 alpine 3.6.0
FROM node:13.14.0-alpine

# Label for tracking
LABEL nl.openstad.container="api_container" nl.openstad.version="0.0.1-beta" nl.openstad.release-date="2020-05-07"

ENV API_URL="" \
    API_HOSTNAME="" \
    API_DATABASE_USER="" \
    API_DATABASE_PASSWORD="" \
    API_DATABASE_DATABASE="" \
    API_DATABASE_HOST="" \
    API_EMAILADDRESS="" \
    API_EXPRESS_PORT="" \
    API_MAIL_FROM="" \
    API_MAIL_TRANSPORT_SMTP_PORT="" \
    API_MAIL_TRANSPORT_SMTP_HOST="" \
    API_MAIL_TRANSPORT_SMTP_REQUIRESSL="" \
    API_MAIL_TRANSPORT_SMTP_AUTH_USER="" \
    API_MAIL_TRANSPORT_SMTP_AUTH_PASS="" \
    API_NOTIFICATIONS_ADMIN_EMAILADDRESS="" \
    API_SECURITY_SESSIONS_COOKIENAME="" \
    API_SECURITY_SESSIONS_ONLYSECURE="" \
    API_AUTHORIZATION_JWTSECRET="" \
    API_AUTHORIZATION_FIXEDAUTHTOKENS="" \
    AUTH_API_URL=""

# Install all base dependencies.# add perl for shell scripts
RUN apk add --no-cache --update g++ make python musl-dev bash perl perl-dbd-mysql perl-posix-strftime-compiler \
&&  echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/main' >> /etc/apk/repositories \
&&  echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories \
&&  apk update \
&&  apk add mongodb=3.4.4-r0 \
&&  apk add mongodb-tools

# Set the working directory to the root of the container
WORKDIR /home/app

# Bundle app source
COPY --chown=node:node package.json package-lock.json /home/app/

# Install node dependencies
RUN npm install \
# Remove unused packages only used for building.
&& apk del g++ make python \
&& rm -rf /var/cache/apk/*

# Set node ownership to /home/app
RUN chown -R node:node /home/app
COPY --chown=node:node . /home/app/
USER node

# ----------------------------------------------
# Already present in dockerfile:

# # Must execute on run instead of build
#create database
#script forcing wait for mysql needs to be set
# RUN node reset.js


# Already present in dockerfile:
# Mount persistent storage
# ----------------------------------------------

# Exposed ports for application
EXPOSE 8111/tcp
EXPOSE 8111/udp

# Run the application
CMD [ "npm", "start" ]
