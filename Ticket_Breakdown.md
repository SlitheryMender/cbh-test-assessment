# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

Assuming that the agents work for different shifts at different facilities, 

### Ticket 1 : We need to support saving custom ids for Agents as per what the facilities choice on the database
- Since agents can work for multiple facilities, we would need a new table, say AgentsAlias, which would have the Agent's internal database id, Facilities internal database id and their custom id for agents (alias) along with a primary key (in this case can be just a counter starting from 1);
- We also need methods, 
    'createCustomID' - Takes in Facility ID, Agent internal ID, Agent custom id to create custom id for Agent for that particular Facility
    'updateCustomID' - Takes in Facility ID, Agent internal ID, Agent custom id to update custom id for Agent for that particular facility
    'removeCustomID' - Takes in Facility ID, Agent internal ID to remove/invalidate the entry for custom id for Agent for that Facility
    'getAgentsCustomID' - Takes in Facility ID, Agent internal ID to retrieve custom id for Agent for that Facility

Acceptance Criteria : Any invalid inputs or must throw an error but shouldn't update the database. The APIs should be able to add/update/remove custom IDs for Agents and Facilities only. 
Time Estimate : 2 days

### Ticket 2 : Create function 'getAllCustomIDsForFacility' to get all the Agents' who have their custom IDs assigned by that Facility
- 'getAllCustomIDsForFacility' should query the AgentsAlias table using the FacilityID to retrive all Agents who have been assigned the custom ID

Acceptance Criteria : 0.5-1 day 

### Ticket 3 : Create function 'getShiftAgentsMetadata' to add the Agent's custom id to the Agent metadata provided by 'getShiftsByFacility'
- 'getShiftsByFacility' currently returns all the Shifts worked that quarter for a Facility with some metadata for Agents
- Instead of modifying it, going for an extra middleware helps in easy testing and avoid breaking existing functionality
- The 'getShiftAgentsMetadata' takes the list returned by 'getShiftsByFacility' as input and basically should do the following things
    -- Get list of all Agent Custom IDs for that Facility using 'getAllCustomIDsForFacility' function
    -- *Making a single SQL query to get all assigned custom IDs is better in performance than making multiple queries for multiple agents custom IDs
    -- For each shift, check the agent's internal id against the list of all Agent Custom IDs returned by 'getAllCustomIDsForFacility' to get the custom ID (if assigned) for the agent and add that info to the metadata.
    -- If custom IDs are not found for a particular agent, their custom ID should be NULL.

Acceptance Criteria : All the agents' metadata, in the shifts returned by 'getShiftsByFacility' should be updated to have a field 'customID', storing the custom IDs for agents in the metadata which can either be a string value or NULL.
Time : 2 days

### Ticket 4 : Updates to the function 'generateReport' to include the custom ID for the agents
- List of shifts with updated metadata will be returned by 'getShiftAgentsMetadata'
- While generating the reports, 'generateReport' method should include the new field customID provided in the metadata for displaying Agent's information (along with internal database ID)
- If customID is null for any agent, the internal database ID will help find the right Agent in case of any cross-verification or correction.

Acceptance Criteria :The reports should now contain customID for each agent along with the internal database id.
Time : 1 day

