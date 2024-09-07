pipeline {
  agent any

  environment {
        PLATFORMS = 'linux/amd64,linux/arm64'
        DOCKER_TLS_CONTEXT = 'my-tls-context'
        DOCKER_HOST = 'tcp://docker:2376'
        CA_CERT = '/certs/client/ca.pem'
        CLIENT_CERT = '/certs/client/cert.pem'
        CLIENT_KEY = '/certs/client/key.pem'
        BUILDER_NAME = 'multiarch-builder'
    }

  stages {
    stage('Construct Repository URL') {
      steps {
          script {
              // Extract and format the GIT_URL to match 'gitea.zelak.dev/zelak/vba-next-wasm'
              def gitUrl = env.GIT_URL ?: 'unknown'
              
              // Strip protocol if present (e.g., https:// or git@)
              def formattedUrl = gitUrl.replaceAll('https://|git@', '').replace(':', '/').replace('.git', '')
              
              echo "Original GIT_URL: ${gitUrl}"
              echo "Formatted Repository URL: ${formattedUrl}"
              
              // Use formattedUrl wherever you need the formatted repo URL
          }
      }
  }

    stage('Install QEMU with tonistiigi/binfmt') {
        steps {
            script {
                // Install QEMU for multi-platform builds using tonistiigi/binfmt
                sh 'docker run --rm --privileged tonistiigi/binfmt --install all'
            }
        }
    }

    stage('Setup Docker Context and Buildx') {
        steps {
            script {
                // Create Docker context with TLS configuration
                sh """
                docker context create ${DOCKER_TLS_CONTEXT} \
                    --docker "host=${DOCKER_HOST},ca=${CA_CERT},cert=${CLIENT_CERT},key=${CLIENT_KEY}"
                """
                sh "docker buildx create --name ${BUILDER_NAME} --driver docker-container --use ${DOCKER_TLS_CONTEXT}"
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
            // Detach the builder instance to safely remove it
            sh 'docker buildx stop ${BUILDER_NAME}'
            
            // Switch back to the default context
            sh 'docker context use default'

            // Remove the custom TLS context
            sh 'docker context rm ${DOCKER_TLS_CONTEXT}'
            sh 'docker buildx rm ${BUILDER_NAME}'
        }
    }
}
}