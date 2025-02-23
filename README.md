Decision Log : 
1. Sepratet container go blochaine lisener (In a real case it should be separate to avoid any problem with backend efecting lisener, also there is no direct conection backed-lisener)
2. Not knowing typscript I decidet to use it (Test myslef a bit and learn no thinks )
3. Security is neglected due to this being a simple project with public resoucres 
4. WebsocketProvider is used to get ivents instantly.

### Data base desaing 
- row input table (as names states first place where record is inserted, input shoud be fast and simple table it self will not be quered so indexes are not so important, also they slow insert)
Comands: 
docker-compose up -d     # Run app 


API-KEY: 
dc5a0385bedf44e69def4cd00e209091