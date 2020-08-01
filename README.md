# La Tienda del BEBE
### How to run
1. `yarn install`
2. `yarn dev`
3. Go to `localhost:8080`

### Command list
* `yarn deploy`
* `yarn deplot-win`
* `yarn build`
* `yarn buildjs`
* `yarn buildreact"`
* `yarn server`

### build and deploy to docker
on dev:
1. rm -r dist // clean dist directory
2. yarn deploy
3. docker build . -t latiendadelbebe
4. docker save latiendadelbebe -o latiendadelbebe.tar

on server:
1. docker load latiendadelbebe.tar
2. copy docker-compose.yml from dev
3. docker-compose up -d

### Backup data
1. mkdir backup
2. docker volume ls // get volumes name
3. docker run --rm -v latiendadelbebe_data:/data -v latiendadelbebe_upload:/upload -v `pwd`/backup:/backup busybox sh -c 'cp -r /data /backup && cp -r /upload /backup'