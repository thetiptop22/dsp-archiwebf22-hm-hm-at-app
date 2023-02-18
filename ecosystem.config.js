module.exports = {
    apps: [{
      name: 'The_Tiptop',
      script: './index.js',
  
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      instances: "4",
      exec_mode: "cluster",
      watch: false,
      // ignore_watch : ["node_modules", "client/img"],
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      env_development: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }],
  
    deploy: {
      production: {
        user: 'root',
        host: 'localhost',
        ref: 'origin/main',
        repo: 'git@github.com:thetiptop22/dsp-archiwebf22-hm-hm-at-app.git',
        path: '/app',
        'pre-setup': '',
        'pre-deploy-local': "echo 'This is a local executed command'",
        'post-deploy': 'npm i && pm2 reload ecosystem.config.js --env production',
        "post-setup": "ls -la"
      }
    }
  };