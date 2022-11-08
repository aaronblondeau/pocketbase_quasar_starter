# PBStarter (com.aaronblondeau.parallax-sample)

PocketBase Starter Project

This is a demo/starter for using Pocketbase with Quasar for rapid application development.

# Backend - Pocketbase

Begin by downloading pocketbase, extracting the executable and running it locally. I recommend doing this in the "pocketbase" folder included in this project. Full instructions can be found here : [https://pocketbase.io/docs/](https://pocketbase.io/docs/).

```
./pocketbase.exe serve
```

Once Pocketbase is running, go to http://127.0.0.1:8090/_/ and create an admin account.

Then, go to Settings > Import collections, and import ./pocketbase/collections.json

While in settings make sure to configure the application name and configure SMTP settings (with Mailtrap). 

## Frontend - Quasar

```bash
# install dependencies
yarn
# run
yarn dev
```
