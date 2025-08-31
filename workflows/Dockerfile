FROM n8nio/n8n:latest

COPY n8n_workflow.json /workflows/n8n_workflow.json
COPY n8n_credentials.json /workflows/n8n_credentials.json

ENTRYPOINT sh -c "n8n import:workflow --input /workflows/n8n_workflow.json && \
  n8n import:credentials --input /workflows/n8n_credentials.json && \
  n8n update:workflow --id m927KcCBR0Gfwx2y --active=true && \
  n8n start"
