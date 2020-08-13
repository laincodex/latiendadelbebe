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
First build on dev side 

[automate]:

> sh build-docker-prod.sh **\<version\>**

[manual]:

> rm -r dist // clean dist directory
> yarn deploy
> docker build . -t latiendadelbebe:version
> docker save latiendadelbebe:**version** -o latiendadelbebe-**version**.tar


Then pull on server:

> docker load latiendadelbebe-**version**.tar
> copy docker-compose.yml from dev
> docker-compose up -d


### Backup data
> mkdir backup
> docker volume ls
> docker run --rm -v latiendadelbebe_data:/data -v latiendadelbebe_upload:/upload -v \`pwd\`/backup:/backup busybox sh -c 'cp -r /data /backup && cp -r /upload /backup'