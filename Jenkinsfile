pipeline {
  agent any
  stages {
    stage('Build') {
      agent any
      environment {
        test = 'secrect'
      }
      steps {
        sh 'docker build . -t gitea.zelak.dev/Zelak/vba-next-wasm:latest'
      }
    }

    stage('Login to gitea') {
      environment {
        GITEA_PASSWORD = credentials('31f190d2-0c8c-4349-89cf-09cacf935460')
      }
      steps {
        script {
          sh "echo ${GITEA_PASSWORD} | docker login gitea.zelak.dev -u Zelak --password-stdin"
        }
      }
    }

    stage('push docker') {
      environment {
        GITEA_PASSWORD = credentials('31f190d2-0c8c-4349-89cf-09cacf935460')
      }
      steps {
          script {
              sh "docker push gitea.zelak.dev/Zelak/vba-next-wasm:latest"
          }
      }
    }
  }
}