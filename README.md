# Kubernetes Application Deployment

## Table of Contents

- [Objective](#objective)
- [Application Description](#application-description)
- [Containerization](#containerization)
- [Kubernetes Configuration](#kubernetes-configuration)
- [Scaling](#scaling)
- [Networking](#networking)
- [Monitoring](#monitoring)

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
- **Name:** backend-k8s
- **Container Image:** aptroide/backend-k8s:V3
- **Resources:** 
  - Memory Limit: 128Mi
  - CPU Limit: 250m
- **Port:** 3000

##### Service
- **Name:** backend-k8s
- **Type:** NodePort
- **Port:** 3000
- **Target Port:** 3000

#### Frontend Deployment and Service

##### Deployment
- **Name:** frontend-k8s
- **Container Image:** aptroide/fronted-k8s:V3.1
- **Resources:** 
  - Memory Limit: 1024Mi
  - CPU Limit: 500m
- **Port:** 3000

##### Service
- **Name:** frontend-k8s
- **Type:** NodePort
- **Port:** 3000
- **Target Port:** 3000

#### Importance of Service Type

- **ClusterIP:** Used for internal communication within the Kubernetes cluster. This is used for **database service (MongoDB)** to ensure secure and efficient access within the cluster.

- **LoadBalancer:** Used on **Frontend and Backend services** Exposes the service on each node's IP at a static port. This is suitable because these services need to be accessible from outside the Kubernetes cluster, allowing external traffic to reach the application.

In the Frontend deployment, we allocate more resources compared to the backend deployment. This is necessary because React requires additional memory to compile its dependencies and render the graphical interface.

By separating the deployments and services, we achieve modularity, scalability, and ease of management, ensuring each component of the application can be independently managed and scaled as needed.

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
k apply -f backend_D_S.yaml
k apply -f mongo_D_S.yaml
k apply -f fronted_D_S.yaml
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
