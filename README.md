# Log Service

> Access: ***http://ec2-18-234-140-23.compute-1.amazonaws.com/api/v1/logs***

A microservice-based logging system that processes and stores user activity logs using Kafka and MongoDB.

## Project Structure

```
log_service/
├── app/                      # Main application
│   ├── application/          # Application services
│   ├── domain/               # Domain entities and interfaces
│   ├── infrastructure/       # External dependencies implementation
│   └── interface/            # API controllers and routes
├── producer/                 # Kafka producer for testing
├── k8s/                      # Kubernetes manifests (optional)
├── .github/workflows/        # CI/CD pipeline configuration
└── docker-compose.yml        # Local development setup
```

---

### Technology Stack

> **Node.js** , **Express**, **MongoDB**, **Kafka**, **Docker**, **Kubernetes**, **GitHub Actions**, **AWS EC2**

### Architecture Decisions

1. **Services**:

   - `Log Service`: the main service. It consumes logs from a Kafka topic, processes them by adding a status field (status: "processed") and a timestamp, and then stores them in MongoDB.

   - `Kafka`: A message queue for logs, decoupling the Producer and Log services.

   - `Producer Service`: Simulates a log source for the system by publishing logs to the Kafka topic.

   - `MongoDB`: Serves as the database that stores logs after they have been processed by the Log Service.

2. **Software**:
   I've used Clean Architecture to separate concerns, and make the system more maintainable and scalable. Also I used Docker containers to ensure the environments stay consistent from development to production.

3. **Data Management**
   To prevent unlimited storage growth, i created a TTL index on the `createdAt` field. This index automatically removes log entries after 1 hour.
4. **Deployment**

   The services are deployed on an AWS EC2 instance with Git and Docker installed. When new changes are pushed to the `master` branch on GitHub, GitHub Actions triggers a CI pipeline to perform the following steps:

   - Builds Docker images for both the **Log Service** and the **Producer Service**
   - Pushes the images to a public Docker Hub repository
   - Connects to the EC2 instance and deploys the updated services

   > I chose this approach because AWS EKS is a paid service, and unfortunately, I couldn't access a Google Cloud account.

## Setup Instructions

### Prerequisites

`Docker` <--> `Docker Compose` <--> `Node.js` <--> `AWS Account(Free Tier)`

### Locally

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd log_service
   ```

2. Start the services using Docker Compose:

   ```bash
   docker-compose up -d
   ```

3. Access the API at http://localhost:3000/api/v1/logs

### Production Deployment (AWS EC2)

1. Set up an EC2 instance:

   - Enable SSH connection
   - Install Git, Docker, and Docker Compose

2. Configure GitHub Secrets:

   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Your Docker Hub access token
   - `EC2_HOST`: Your EC2 instance's public IP address
   - `EC2_SSH_KEY`: Your EC2 SSH private key

3. Push to the master branch to trigger the CI/CD pipeline:

   ```bash
   git push origin master
   ```

4. The GitHub Actions workflow will:

   - Build and push Docker images to Docker Hub
   - Deploy the application to the EC2 instance
   - Set up the necessary services (MongoDB, Kafka, ZooKeeper)

5. Access the API at http://<_EC2-Public-IPv4-DNS_>/api/v1/logs

## Environment Variables

Configure these variables in `config.env`:

- `PORT`: Application port (default: 3000)
- `DATABASE_URL`: MongoDB connection string
- `DATABASE_USERNAME`: MongoDB username
- `DATABASE_PASSWORD`: MongoDB password

---

## API Endpoints

### Fetch Processed Logs

```
GET api/v1/logs?page=1&limit=10&userId=user-123&action=view&startDate=2025-04-01&endDate=2025-04-02
```

#### Query Parameters:

- `page` (int) - Page number --> {optional, default: 1}
- `limit` (int) - Number of logs per page --> {optional, default: 10}
- `userId` (string) - Filter by user ID --> {optional}
- `action` (string) - Filter by action type (view, click, etc.) --> {optional}

#### Response Format:

```json
{
  "status": "success",
  "results": 10,
  "data": [
    {
      "_id": "67eb43bd528e57324dfd18c0",
      "userId": "user-321",
      "action": "purchase",
      "status": "Processed",
      "createdAt": "2025-04-01T01:39:09.676Z"
    }
    // More logs...
  ]
}
```
