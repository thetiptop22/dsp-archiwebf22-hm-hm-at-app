module.exports = {
    apps: [{
      name: '7linky',
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
        host: '178.170.37.129',
        ref: 'origin/main',
        repo: 'git@github.com:malkico/dsp-archiwebf22-hm-hm-at-workflow.git',
        path: '/workflow',
        'pre-setup': '',
        'pre-deploy-local': "echo 'This is a local executed command'",
        'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
        "post-setup": "ls -la"
      }
    }
  };