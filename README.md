# Career Site Microservice

This microservice serves API requests for Career Site.

**Dependencies**:

## Documentation

## Requirements

This project is developed with:

- Node 16 or higher version stable

- Postgres 14

## Installation

Clone the project

```bash
git clone https://github.com/ferriyusra/career-service.git
```

Go to the project directory

```bash
cd career-service
```

This service contains a `.env.example` file that defines environment variables you need to set. Copy and set the variables to a new `.env` file.

```bash
cp .env.example .env
```

Start the app

```bash
node app.js
```

## Database

If you have not created the database for this service, please create one before going to the next step.

This microservice depends on `sequelize-cli` package. To install globally

```
npm install -g sequelize-cli
```

### Running Migrations

Create database migration

```
sequelize migration:create --name create_table_names_table
```

Run database migration

```
sequelize db:migrate
```

### Running Seeds

Run default seeds

```
sequelize db:seed:all
```

Run specific seed

```
sequelize db:seed --seed ./database/seeders/name_seed.js
```

For dev only, insert dummy data

```
sequelize db:seed:all --seeders-path 'database/seeders/dummy'
```

## Testing

Test the service

```bash
npm test
```

## Deployment

### Without Docker

Follow the Installation instruction above

### With Docker

Build the image

```bash
docker build -f Dockerfile.api -t career-service .
```

Run the container

```bash
docker run -d --name career-service-1 -p 3001:3000 --network=host --env-file=.env career-service
```
