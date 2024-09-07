pipeline {
  agent any
  stages {
    stage('Build') {
      agent any
      environment {
        test = 'secrect'
      }
      steps {
        sh 'docker build . -t test:latest'
      }
    }

  }
}