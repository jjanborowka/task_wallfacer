Decision Log : 
1. Sepratet container go blochaine lisener (In a real case it should be separate to avoid any problem with backend efecting lisener, also there is no direct conection backed-lisener)
2. Not knowing typscript I decidet to use it (Test myslef a bit and learn no thinks )
3. Security is neglected due to this being a simple project with public resoucres 
4. WebsocketProvider is used to get ivents instantly.
5. Data warhouse to optimized over data agregation.
6. row_input_table , simple table to access, logs of every action in the data base in a sense, even if more complex insert fail it will still be there. 
7. row wise trigger - in this mode of operation when we read one record at a time there is no point of statment wise trigger, and it will requaier additional data read from input table , it will be more sutebule for reading history but this is not a main perpouse 
8. statisic and advance insert in one trigger , no need to split and it will add additional overhead
### Data base desaing 
- row input table (as names states first place where record is inserted, input shoud be fast and simple table it self will not be quered so indexes are not so important, also they slow insert) 
#### Data wearhouse 
I decaided to bulid vary limited, data warhouse using fact tabla and data dimensions, since this is the structure optimized for data aggregation. 

#### FACT_TABLE 
Table storing basic data about every transation, with indexing over time stamp, Its a main table that will be conected to another dimensions tables (in this simple example one table) via foregin key,

#### DATE DIMNESION 
Table in a from of the calendar storing data about date, usfull for complex query involving date.

#### STATISTIC TABLE 
Small table containing preagregated statisitcs. 


Comands: 
docker-compose up -d     # Run app 


API-KEY: 
dc5a0385bedf44e69def4cd00e209091