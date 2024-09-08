pipeline {
  agent any

  stages {
    stage('Run Multi-Platform Docker Build') {
      steps {
        script {
          multiPlatformDockerBuild("gitea.zelak.dev", ['linux/amd64', 'linux/arm64'])
        }
      }
    }
  }

  post {
    always {
      script {
        multiPlatformDockerBuild.cleanup()
      }
    }
  }
}