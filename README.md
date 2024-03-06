
# Tech Interview Assignment - Roberto

## Some assumptions on the requirements:
1. **Timezone:**
   - The timezone of the data is assumed to be GMT+0.

2. **File Format:**
   - For this demo, the system is designed to support the NEM12 format exclusively.

3. **File Processing Scope:**
   - The scope is limited to reading a single file locally at a time.

4. **Supported Records:**
   - The system currently supports reading a single file at a time, and it only considers `100`, `200`, and `300` records.

5. **File Validation:**
   - There's currently no validation check for the file.
   - It's assumed that the file is always valid (e.g., no 0 or negative interval).

6. **Other:**
   - The `.env` file is purposely committed for this assignment for easy setup.



## Thought Process:

1. **Handling Multiple 200 Records for the Same Period:**
   - Given a single NMI can have multiple 200 records for the same period. Two implementation choices:
      a. Follow the given table structure and sum all the meter readings for the same NMI and period.
         - For example, NEM1201009 for 20050301 at 00:00 AM will sum both E1 and E2 readings at 20050301 at 00:00 AM (multiple 300 records).
      b. Update the table structure to add a new field `nmi_suffix`.
         - Also, update the constraint `meter_readings_unique_consumption` to include this field.

2. **Choice for Implementation:**
   - For this demo, the decision is made to proceed with method 2 (option b).
   - This allows for flexibility, as data can be summed later on if needed for reporting.

3. **Technology Stack:**
   - Using Nest.js for implementation.
   - PostgreSQL for the database.
   - Jest for testing and performance measurements.

4. **File Processing Strategy:**
   - Since it should support a huge file, it should process the file by reading it as a stream.

5. **Support for Any Valid Interval:**
   - Supports any valid interval by dividing `24 * 60 / interval duration` on `100` record.
  
## Future Improvements:

1. **Database Scaling:**
   - Enable multiple write nodes in the PostgreSQL DB.
   - Run multiple instances to process multiple files simultaneously.

2. **Cloud Migration:**
   - If moved to the cloud:
      - Assuming processing the largest file won't exceed 15 minutes.
      - Move the code to AWS Lambda.
      - Store files in Amazon S3.
      - Trigger the processing manually or use an event on upload to trigger the Lambda.

3. **High Availability Database:**
   - For the database:
      - Move to Amazon RDS with Multiple Availability Zones (PostgreSQL) for high availability.

## Running the app

1. Setup Postgres DB locally with setting matching the env DB URL: `postgresql://admin:secret@localhost:5432/meter_data`
2. Run migration `npm run migration:run`
3. Run the app `npm run start` and it will consume the `sample_file.csv` that is part of this repo and process it to the DB. (DB result screenshot attached below)

![Screenshot 2024-03-06 at 21 53 22](https://github.com/robertos95/meter-data-importer/assets/35228010/763d5ee7-006e-4213-9f1b-7be40784422c)

## Running the test
Unit tests are also included via `npm run test`
