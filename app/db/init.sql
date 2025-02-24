
-- ROW INPUT TABLE 
CREATE TABLE IF NOT EXISTS row_input_table(
    ID SERIAL PRIMARY KEY,
    EVENT_TYPE VARCHAR(30) NOT NULL,
    EVENT_SENDER VARCHAR(300) NOT NULL,
    EVENT_RECEIVER VARCHAR(300) ,
    EVENT_OWNER VARCHAR(300) NOT NULL,
    EVENT_ASSETS NUMERIC(78,0) NOT NULL,
    EVENT_SHARES NUMERIC(78,0) NOT NULL,
    BLOCK_NUMBER NUMERIC(78,0) NOT NULL,
    TRANSACTION_HASH VARCHAR(300) NOT NULL,
    TIME_STAMP TIMESTAMPTZ DEFAULT NOW() 
);



-- Suporting dimension, date dimension will making any operations revolving dates easier
CREATE TABLE IF NOT EXISTS date_dimension (
    date_id SERIAL PRIMARY KEY,
    full_date DATE NOT NULL UNIQUE,
    year INT NOT NULL,
    quarter INT NOT NULL,
    month INT NOT NULL,
    day INT NOT NULL,
    day_of_week INT NOT NULL,
    day_name TEXT NOT NULL,
    month_name TEXT NOT NULL,
    is_weekend BOOLEAN NOT NULL
);

-- Index for fast retrieval by date
CREATE INDEX idx_date_dimension_full_date ON date_dimension(full_date);

DO $$ 
DECLARE 
    start_date DATE := '2000-01-01';  -- Change to your desired start date
    end_date DATE := '2100-12-31';    -- Change to your desired end date
    current_date DATE := start_date;
BEGIN 
    INSERT INTO date_dimension (
    full_date, 
    year, 
    quarter, 
    month, 
    day, 
    day_of_week, 
    day_name, 
    month_name, 
    is_weekend
)
SELECT
    gs::date AS full_date,
    EXTRACT(YEAR FROM gs) AS year,
    EXTRACT(QUARTER FROM gs) AS quarter,
    EXTRACT(MONTH FROM gs) AS month,
    EXTRACT(DAY FROM gs) AS day,
    EXTRACT(DOW FROM gs) + 1 AS day_of_week,  -- PostgreSQL DOW: 0 = Sunday
    TO_CHAR(gs, 'Day') AS day_name,
    TO_CHAR(gs, 'Month') AS month_name,
    CASE WHEN EXTRACT(DOW FROM gs) IN (0, 6) THEN TRUE ELSE FALSE END AS is_weekend
FROM generate_series('2000-01-01'::date, '2100-12-31'::date, '1 day'::interval) AS gs
WHERE NOT EXISTS (SELECT 1 FROM date_dimension);
END $$;


-- Table in the center of our data warhorse , will be qured offen so need to be optimal 
CREATE TABLE IF NOT EXISTS FACT_TABLE(
    ID SERIAL PRIMARY KEY,
    DATE_ID INT NOT NULL,
    EVENT_TYPE VARCHAR(30) NOT NULL,
    EVENT_SENDER BYTEA NOT NULL,
    EVENT_RECEIVER BYTEA ,
    EVENT_OWNER BYTEA NOT NULL,
    EVENT_ASSETS NUMERIC(78,0) NOT NULL,
    EVENT_SHARES NUMERIC(78,0) NOT NULL,
    BLOCK_NUMBER NUMERIC(78,0) NOT NULL,
    TRANSACTION_HASH BYTEA NOT NULL,
    TIME_STAMP TIMESTAMPTZ DEFAULT NOW() ,
    FOREIGN KEY (DATE_ID) REFERENCES date_dimension(DATE_ID)

);
CREATE INDEX idx_fact_table ON FACT_TABLE(TIME_STAMP);
CREATE INDEX idx_transaction_hash on FACT_TABLE(TRANSACTION_HASH); -- to check duplication 
CREATE INDEX idx_event_type on FACT_TABLE(EVENT_TYPE);


-- Table containing statistics
-- table in this orientation to make update easy 
CREATE TABLE IF NOT EXISTS   statistics_table(
    EVENT_AVG NUMERIC NOT NUll,
    EVENT_COUNT INT NOT NULL, 
    EVENT_SUM NUMERIC NOT NULL,
    EVENT_TYPE VARCHAR(30) NOT NULL
);
--  PUT only it table empty 
INSERT INTO statistics_table (EVENT_AVG, EVENT_COUNT,EVENT_SUM,EVENT_TYPE )
SELECT * FROM (VALUES
    (0,0,0, 'Withdraw'),
    (0,0,0, 'Deposit')
) AS temp_table(EVENT_AVG, EVENT_COUNT,EVENT_SUM,EVENT_TYPE )
WHERE NOT EXISTS (SELECT 1 FROM statistics_table);


--- TRIGGERS 
--- DATA INSERTION TRIGGER 
CREATE OR REPLACE FUNCTION insert_data_function()
RETURNS trigger AS
$$
BEGIN
    -- INSERT DATA 
    INSERT INTO FACT_TABLE (
        DATE_ID,
        EVENT_TYPE,
        EVENT_SENDER,
        EVENT_RECEIVER,
        EVENT_OWNER,
        EVENT_ASSETS,
        EVENT_SHARES,
        BLOCK_NUMBER,
        TIME_STAMP,
        TRANSACTION_HASH
    )
    SELECT 
        (SELECT DATE_ID FROM date_dimension WHERE full_date = DATE(NEW.TIME_STAMP)), 
        NEW.EVENT_TYPE,
        DECODE(SUBSTRING(NEW.EVENT_SENDER FROM 3), 'hex'),  
        CASE 
        WHEN NEW.EVENT_RECEIVER IS NOT NULL THEN DECODE(SUBSTRING(NEW.EVENT_RECEIVER FROM 3), 'hex')
        ELSE NULL
        END,
        DECODE(SUBSTRING(NEW.EVENT_OWNER FROM 3), 'hex'),
        NEW.EVENT_ASSETS,
        NEW.EVENT_SHARES,
        NEW.BLOCK_NUMBER,
        NEW.TIME_STAMP,
        DECODE(SUBSTRING(NEW.TRANSACTION_HASH FROM 3), 'hex');

    -- UPDATE STATISTICS 
    UPDATE statistics_table 
    set EVENT_SUM = EVENT_SUM + NEW.EVENT_ASSETS,
    EVENT_COUNT = EVENT_COUNT + 1 ,
    EVENT_AVG = (EVENT_SUM + NEW.EVENT_ASSETS) / (EVENT_COUNT+ 1 )
    where EVENT_TYPE = NEW.EVENT_TYPE;
    RETURN NEW;
    EXCEPTION -- So we don't lose inserted row if something fail here 
        WHEN OTHERS THEN
            RAISE NOTICE 'An error occurred: %', SQLERRM;
            RETURN NEW; 
END;
$$ LANGUAGE plpgsql;

CREATE or REPLACE TRIGGER insert_data_trigger
AFTER INSERT 
ON row_input_table
FOR EACH ROW
EXECUTE FUNCTION insert_data_function();

ALTER TABLE row_input_table ENABLE TRIGGER insert_data_trigger; -- make sure trigger is on 