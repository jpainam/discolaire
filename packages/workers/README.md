pm2 list # See all processes
pm2 logs discolaire-workers # Tail logs
pm2 restart discolaires-workers # Restart on crash/update
pm2 delete discolaires-worker # Stop and remove
pm2 save # Persist on reboot (optional)

pm2 start pm2.config.js

https://github.com/Amenofisch/ts-pm2-template
