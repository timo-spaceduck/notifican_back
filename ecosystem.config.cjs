module.exports = {
  apps: [
    {
      name: 'NotificanNode',
      port: '3992',
      exec_mode: 'cluster',
      instances: '1',
      autorestart: true,
      watch: false,
      script: 'index.js'
    }
  ]
}
