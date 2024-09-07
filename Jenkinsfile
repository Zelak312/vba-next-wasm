pipeline {
  agent any

  environment {
        PLATFORMS = 'linux/amd64,linux/arm64'
    }

  stages {
    stage('Build') {
      agent any
      environment {
        test = 'secrect'
      }
      steps {
        sh 'docker build . -t gitea.zelak.dev/zelak/vba-next-wasm:latest'
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

    stage('Setup Buildx') {
        steps {
            script {
                // Set up Docker Buildx
                sh 'docker buildx create --use'
                sh 'docker buildx inspect --bootstrap'
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
              docker buildx build --platform ${PLATFORMS} -t gitea.zelak.dev/zelak/vba-next-wasm:latest --push .
          }
      }
    }
  }

  post {
        always {
            script {
                // Clean up the Buildx builder instance after the build
                sh 'docker buildx rm'
            }
        }
    }
}