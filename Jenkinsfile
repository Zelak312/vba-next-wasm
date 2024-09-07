pipeline {
  agent any
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

    stage('Login to gitea') {
      steps {
        script {
          withCredentials([string(credentialsId: '31f190d2-0c8c-4349-89cf-09cacf935460', variable: 'GITEA_PASSWORD')]) {
            sh "echo '${GITEA_PASSWORD}' | docker login gitea.zelak.dev -u Zelak --password-stdin"
          }
        }
      }
    }

    stage('push docker') {
      steps {
          script {
              sh "docker push gitea.zelak.dev/zelak/vba-next-wasm:latest"
          }
      }
    }
  }
}