# ResumeAI frontend

## Local development

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to the deployed backend URL for production. It is
embedded into the browser bundle at build time.

When deploying with Render, set `NEXT_PUBLIC_API_URL` on the frontend service
before deploying so it is available during the Docker build.

## Production

```bash
npm ci
npm run build
npm run start
```

The production start script uses Next's standalone server output.

For Docker, pass the backend URL during the image build:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  -t resumeai-frontend .
docker run --rm -p 3000:3000 resumeai-frontend
```
