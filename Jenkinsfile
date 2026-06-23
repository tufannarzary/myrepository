pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub...'
                checkout scm
            }
        }

        stage('Validate Project Structure') {
            steps {
                echo 'Validating required files and folders...'
                sh '''
                    test -f index.html
                    test -d css
                    test -d js
                    echo "Project structure validation completed successfully."
                '''
            }
        }

        stage('Static File Quality Checks') {
            steps {
                echo 'Running basic quality checks for the static website...'
                sh '''
                    mkdir -p reports

                    echo "<html><body><h1>Static Code Quality Report</h1><ul>" > reports/code-quality-report.html

                    if grep -q "<title>" index.html; then
                      echo "<li>PASS: index.html contains a title tag.</li>" >> reports/code-quality-report.html
                    else
                      echo "<li>FAIL: index.html does not contain a title tag.</li>" >> reports/code-quality-report.html
                      exit 1
                    fi

                    if grep -q "css/" index.html; then
                      echo "<li>PASS: CSS reference found in index.html.</li>" >> reports/code-quality-report.html
                    else
                      echo "<li>WARNING: CSS reference not found in index.html.</li>" >> reports/code-quality-report.html
                    fi

                    if grep -q "js/" index.html; then
                      echo "<li>PASS: JavaScript reference found in index.html.</li>" >> reports/code-quality-report.html
                    else
                      echo "<li>WARNING: JavaScript reference not found in index.html.</li>" >> reports/code-quality-report.html
                    fi

                    echo "</ul></body></html>" >> reports/code-quality-report.html
                '''
            }
        }

        stage('Package Website') {
            steps {
                echo 'Packaging website files into a deployable artifact...'
                sh '''
                    rm -rf dist
                    mkdir -p dist
                    cp index.html dist/
                    cp -r css dist/
                    cp -r js dist/
                    tar -czf static-website-build.tar.gz dist
                    echo "Website package created successfully."
                '''
            }
        }

        stage('Simulate Deployment') {
            steps {
                echo 'Simulating deployment to a test environment...'
                sh '''
                    rm -rf deployed-site
                    mkdir -p deployed-site
                    cp -r dist/* deployed-site/
                    echo "Deployment simulation completed successfully."
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'static-website-build.tar.gz', fingerprint: true

            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'reports',
                reportFiles: 'code-quality-report.html',
                reportName: 'Static Code Quality Report'
            ])
        }

        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Review the console output and quality report.'
        }
    }
}
