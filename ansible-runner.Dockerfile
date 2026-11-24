FROM willhallonline/ansible:latest
USER root
RUN apk add --no-cache docker-cli docker-cli-compose py3-pip \
    && pip install --break-system-packages docker
COPY requirements.yml /tmp/requirements.yml
RUN ansible-galaxy collection install -r /tmp/requirements.yml
WORKDIR /workspace
