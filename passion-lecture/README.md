# C294-FrontEnd

## setup da la base de données et de phpmyadmin

assurez vous que le docker daemon soit actif, puis allez dans le repertoire \C294-FrontEnd\Docker_MySQL
lancez alors la commade 'docker compose up -d' dans un invite de commande

allez sur http://localhost:8081/ pour accéder à PhpMyAdmin, entez les identifiants "root" et "root" comme nom et mot de passe
ajoutez une base de données 'db_Web295'

## setup du BackEnd

allez dans le repertoire \C294-FrontEnd\passion-lecture-backend\src
puis lancez la commade 'npm i' dans un invite de commande, une fois l'installation terminée, lancez 'npm start'

## setup de du FrontEnd

allez dans le repertoire \C294-FrontEnd\passion-lecture-vue
puis lancez la commade 'npm i' dans un invite de commande, une fois l'installation terminée, lancez 'npm run dev'

vous trouverez le site web sur le port http://localhost:5173/
