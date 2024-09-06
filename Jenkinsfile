pipeline {
  agent any
  stages {
    stage('Build') {
      agent any
      steps {
        sh 'docker build . -t test:latest'
      }
    }

  }
}