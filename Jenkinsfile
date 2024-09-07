pipeline {
  agent any

  environment {
        PLATFORMS = 'linux/amd64,linux/arm64'
        DOCKER_TLS_CONTEXT = 'my-tls-context'
        DOCKER_HOST = 'tcp://docker:2376'
        CA_CERT = '/certs/client/ca.pem'
        CLIENT_CERT = '/certs/client/cert.pem'
        CLIENT_KEY = '/certs/client/key.pem'
        BUILDER_NAME = 'multiarch-builder'  // Name for your Buildx builder
    }

  stages {
    //stage('Build') {
    //  agent any
    //  environment {
    //    test = 'secrect'
     // }
     // steps {
      //  sh 'docker build . -t gitea.zelak.dev/zelak/vba-next-wasm:latest'
      //}
    //}

    stage('Install QEMU with tonistiigi/binfmt') {
        steps {
            script {
                // Install QEMU for multi-platform builds using tonistiigi/binfmt
                sh 'docker run --rm --privileged tonistiigi/binfmt --install all'
            }
        }
    }

    stage('Setup Docker Buildx with docker-container driver') {
      steps {
          script {
              // Create a Buildx builder using the docker-container driver and TLS settings
              sh """
              docker buildx create --name ${BUILDER_NAME} --driver docker-container --use \
                  --config docker \
                  --host ${DOCKER_HOST} \
                  --tlsverify \
                  --tlscacert ${CA_CERT} \
                  --tlscert ${CLIENT_CERT} \
                  --tlskey ${CLIENT_KEY}
              """
              // Ensure Buildx is set up and ready
              sh "docker buildx inspect ${BUILDER_NAME} --bootstrap"
          }
      }
  }

    stage('Login to gitea') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: '31f190d2-0c8c-4349-89cf-09cacf935460', passwordVariable: 'GITEA_TOKEN', usernameVariable: 'GITEA_USER')]) {
            sh "echo '${GITEA_TOKEN}' | docker login gitea.zelak.dev -u ${GITEA_USER} --password-stdin"
          }
        }
      }
    }

    stage('Push docker') {
      steps {
          script {
              // sh "docker push gitea.zelak.dev/zelak/vba-next-wasm:latest"
              sh "docker buildx build --platform ${PLATFORMS} -t gitea.zelak.dev/zelak/vba-next-wasm:latest --push ."
          }
      }
    }
  }

  post {
    always {
        script {
            // Stop and remove the Buildx builder instance
            sh 'docker buildx stop ${BUILDER_NAME}'
            sh 'docker buildx rm ${BUILDER_NAME}'
        }
    }
}
}