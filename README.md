# Kubernetes Application Deployment

## Table of Contents

- [Objective](#objective)
- [Application Description](#application-description)
- [Containerization](#containerization)
- [Kubernetes Configuration](#kubernetes-configuration)
- [Networking](#networking)
  
## Objective

Apply concepts learned about pods, deployments, and services in Kubernetes to deploy a multi-tier application. 


## Application Description

To-Do list app:
 - **Fronted:** React for the user interface.
 - **Backend:** Node.js with Express.js for handling data processing. 
 - **Database:** MongoDB to store to-do tasks.

## Containerization

Inside the `kubernetes-app-db` folder , the base application is divided into two folders:    

 - `frontend`: to containerize this module, we use `frontend/DockerFile`
    ```bash
    FROM node:14-alpine

    WORKDIR /app

    # add '/app/node_modules/.bin' to $PATH
    ENV PATH /app/node_modules/.bin:$PATH
    # install application dependencies
    COPY package*.json ./
    RUN npm install
    # RUN npm install react-scripts -g

    # copy app files
    COPY . .

    EXPOSE 3000
    CMD ["npm", "start"]
    ```

 - `backend`: to containerize this module, we use `backend/DockerFile`
    ```bash
    FROM node:10-alpine

    WORKDIR /usr/src/app

    COPY package*.json ./

    RUN npm install

    COPY . .

    EXPOSE 3000

    CMD ["node", "server.js"]
    ```
Once we have our Dockerfiles, we need to build them and then push them to Docker Hub so they can be downloaded inside each pod. To accomplish this, we use the following commands:
```bash
docker build . -t <docker hub username>/<image_name>:<tag>
docker push <docker hub username>/<image_name>:<tag>
```

To containerize the **database** we use the base image available on docker hub called `mongo`


## Kubernetes Configuration

Overview of the Kubernetes deployment and service configurations for the web application. The application is separated into three different deployments: frontend, backend, and MongoDB database.

#### MongoDB Deployment and Service

##### Deployment
- **Name:** db-k8s
- **Replicas:** 1
- **Container Image:** mongo
- **Resources:** 
  - Memory Limit: 128Mi
  - CPU Limit: 250m
- **Port:** 27017

##### Service
- **Name:** db-k8s
- **Type:** ClusterIP (default)
- **Port:** 27017

#### Backend Deployment and Service

##### Deployment
- **Name:** backend
- **Container Image:** mateochalacan840/backend:v3
- **Resources:** 
  - Memory Limit: 128Mi
  - CPU Limit: 250m
- **Port:** 3000

##### Service
- **Name:** backend
- **Type:** LoadBalancer
- **Port:** 3000
- **Target Port:** 3000

#### Frontend Deployment and Service

##### Deployment
- **Name:** frontend
- **Container Image:** mateochalacan840/frontend:v3
- **Resources:** 
  - Memory Limit: 500Mi
  - CPU Limit: 500m
- **Port:** 3000

##### Service
- **Name:** frontend
- **Type:** LoadBalancer
- **Port:** 3000
- **Target Port:** 3000

#### Importance of Service Type

- **ClusterIP:** This service type is utilized for internal communication within the Kubernetes cluster. It is specifically used for the database service (MongoDB) to ensure that access within the cluster remains secure and efficient. By using ClusterIP, we can limit the database service's exposure to internal cluster traffic only, enhancing security and performance.
  
- **LoadBalancer:** This service type is employed for Frontend and Backend services. It makes the service accessible by exposing it on the IP address of each node at a specific port. This configuration is ideal because it allows these services to be reached from outside the Kubernetes cluster, thereby enabling external users to interact with the application. LoadBalancers provide a straightforward way to manage external traffic and ensure reliable access to the application.

In the Frontend deployment, we allocate more resources compared to the Backend deployment. This is due to the nature of React, which requires significant memory to compile its dependencies and render the graphical user interface effectively. The additional resources ensure that the Frontend operates smoothly and provides a responsive user experience.

Separating the deployments and services allows us to achieve several key benefits, including modularity, scalability, and ease of management. Modularity means each component of the application is developed and maintained independently, which simplifies updates and troubleshooting. Scalability allows us to adjust resources for each service based on its specific needs, ensuring optimal performance. Ease of management is achieved because each component can be individually monitored and scaled, facilitating more efficient operations and maintenance.

## Networking

To test connectivity between pods, we first need to start minikube cluster using:
```bash
minikube start
```

Setting alias to use kubectl:
```bash
alias k=kubectl
```

Next we apply all our configuration yaml files:
```bash
k apply -f backend.yaml
k apply -f mongo.yaml
k apply -f fronted.yaml
```
And check that all its working fine using:
```bash
k get all
```
or specifically for services, pods or deployments
```bash
k get pods
k get svc
k get deploy
```
![start](/img/kubegetall.png)

We also can check that the app is running inside our minikube cluster and check its conexion:
![start](/img/conexion.png)

Finally its possible to show de Database actualized.
![start](/img/db.png)
