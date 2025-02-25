# Setup 
## Prerequisite:
 - install and start docker 
 - in project catalog 
 ```
 cd app
 docker-compose up -d --build   
 ```
 - app should start on http://localhost:3003/

If you need completely fresh start.
 ```
 docker compose down
 docker image prune -a #!!!! It will remove all containers not only in this project 
 docker compose up --build -d
 ```


# Comments 
App is not exactly as in the description. For example propagated to the page are statistic not event itself. However statistics are calculated for each new event.
Frontend is also very basic, no formatting just dump of data. Due to time constrain app is not publicly deployed.


# Decision Log
## Separate Container for Blockchain Listener
The blockchain listener should be in a separate container to prevent any issues with the backend affecting the listener. There is also no direct connection between the backend and the listener.

## Use of TypeScript
Despite not being familiar with TypeScript, I decided to use it to improve my proficiency in it an also because I know it is used in our company.

## Security Considerations
Security is not a primary concern for this project since it uses public resources and is relatively simple.

## WebSocket Provider
A WebSocket provider is implemented to receive events in real-time.

## Data Warehouse Optimization
The data warehouse is designed to optimize data aggregation.

## Row-wise Trigger
In this mode, reading one record at a time makes statement-wise triggers unnecessary. This approach may require additional reads from the input table. While it's suitable for reading history, it is not the primary purpose. 

## Combined Statistics and Advanced Inserts
There’s no need to split statistics and advanced inserts into separate triggers, as doing so would add unnecessary overhead.

## Auto-generated Frontend
The frontend will be auto-generated, as this is not the focus of the task. The aim is to keep it as simple as possible.

## Testing Scope
Testing is limited to simple atomic functions. More advanced tests would require operations between multiple Docker containers, complicating the process.

## Module Testing Limitations
Due to time constraints, tests have been included for only one module.


# Data Base Design 

## ROW_INPUT_TABLE 
- fast insert due to lack of indexes,
- containing all data retrieved for an event
- It is not strictly necessary, serves a prepuce of preventing any record loss on complex insert, should be replaced by a msg broker in real application, or at least msg broker should be added before it 

## DATE DIMENSIONS 
- calendar table that makes any search on dates fast end efficient, for example number of transitions per day of the week
- can be extended by any data needed by specif queries
### Indexes 
- full_date - makes filtration on date fast 
- day_of_week - speeds up group by day of the week 

## FACT TABLE 
- main table storing data about event
- connected with date dimension via DATE_ID
- almost every query will be going trough this table 
### Indexes
- TIME_STAMP for more precises search on dates
- TRANSACTION_HASH for deduplication, since duplication is technically possible here (read historical event twice), this index can be use to periodic run process for deduplication
- EVENT_TYPE for filtering by event type 

## STATISTICS_TABLE
- table holding precalculated statistic
- to small for index to have sens 

## TRIGGER
- row wise do to app primal function being reading single record at the time 
- try catch so record is not removed from ROW_INPUT_TABLE if something fails 
- Inserts into fact table after finding right DATE_ID 
- calculates statistic and update statistic table
- send event to backend 

## COMMENTS 
- data warehouse is structured for serving analytics queries
- can be extended by another dimensions to serve different queries ex. wallet-dimension, block-dimension
- indexes can be added to improve performance depending on query needs 