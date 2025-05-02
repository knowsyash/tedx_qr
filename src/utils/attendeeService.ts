import { Attendee, ScanResult } from '../types';
import { useState, useEffect } from 'react';
//@ts-ignore
import Papa from 'papaparse';

// Mock database of attendees
const attendees: Attendee[] = [
 

 
{id: '0fbf316e-08b1-4af8-96e4-d44679ffe84c', ticketType: 'Standard', isCheckedIn: false},

{id: '67fc9b18-50c8-48e1-b607-81b6154d9872', ticketType: 'Standard', isCheckedIn: false},


{id: 'ca66a7f1-53dd-4427-87f8-88720666c640', ticketType: 'Standard', isCheckedIn: false},

{id: 'dbc23362-11a4-4038-bb50-cdc0cc048602', ticketType: 'Standard', isCheckedIn: false},


{id: '89c9bd7f-9cf7-4202-b59e-206c36ef4329', ticketType: 'Standard', isCheckedIn: false},

{id: 'aab6a284-bb21-4cf9-a184-c0a830ff67a8', ticketType: 'Standard', isCheckedIn: false},

{id: '9913c76e-447e-4672-9f7d-ce7fa2e268f8', ticketType: 'Standard', isCheckedIn: false},

{id: 'fec508b4-4ce7-4f14-8753-f88d79e50726', ticketType: 'Standard', isCheckedIn: false},

{id: 'de381211-be27-469a-bea1-fefdb113a410', ticketType: 'Standard', isCheckedIn: false},

{id: 'd7371e7c-682f-47da-8ede-2db2d70f8471', ticketType: 'Standard', isCheckedIn: false},

{id: '8d08c1d1-74e2-4bda-81b3-f37f8c9374fd', ticketType: 'Standard', isCheckedIn: false},
 
{id: '6bbc2dfd-d022-4797-9395-b555a3021cb9', ticketType: 'Standard', isCheckedIn: false},

{id: 'f79a999d-ff56-477e-8fa3-08a2b4eac434', ticketType: 'Standard', isCheckedIn: false},
 
{id: 'e342b424-bca6-4465-8d37-67889d0fe298', ticketType: 'Standard', isCheckedIn: false},

{id: 'bdb58abb-6882-4d40-902c-0b84e09c66f2', ticketType: 'Standard', isCheckedIn: false},
 
{id: '6de43340-8911-44fd-a1d1-094aff2b1cdb', ticketType: 'Standard', isCheckedIn: false},

{id: 'b7fc7dc5-1c19-4122-9373-1747b9c688f7', ticketType: 'Standard', isCheckedIn: false},

{id: '5ce16567-da1a-4256-b071-0dd2120d2827', ticketType: 'Standard', isCheckedIn: false},

{id: '0feb3323-be53-4706-9224-77a5415486d9', ticketType: 'Standard', isCheckedIn: false},

{id: '4924831d-8355-4219-9d49-a0888c2310e0', ticketType: 'Standard', isCheckedIn: false},

{id: 'dfb72529-9cf3-48aa-8603-3ecdf3e5abf7', ticketType: 'Standard', isCheckedIn: false},

{id: '00196327-18a4-40c6-bbbb-92f96d220192', ticketType: 'Standard', isCheckedIn: false},

{id: '3a7edad6-9258-4a3c-9dbd-80c716f81a33', ticketType: 'Standard', isCheckedIn: false},

{id: '36313bc6-9691-4175-9c37-24aaf01b7d50', ticketType: 'Standard', isCheckedIn: false},
 
{id: 'bfa368c9-9220-47bc-9708-9b883abb6db3', ticketType: 'Standard', isCheckedIn: false},

{id: '9914ddf8-7597-4a71-bccc-685177688898', ticketType: 'Standard', isCheckedIn: false},
 
{id: '47eaca66-1c4b-4bbb-a840-f0dc4eca00b7', ticketType: 'Standard', isCheckedIn: false},

{id: '5479bf77-202c-4eab-b6bb-b89d2d3df810', ticketType: 'Standard', isCheckedIn: false},

{id: '01d6df33-9c58-49f2-b88a-abac1c6630e0', ticketType: 'Standard', isCheckedIn: false},

{id: '42ee3abf-4604-4f73-82c7-5c80ab8fb4c1', ticketType: 'Standard', isCheckedIn: false},

{id: '2c5624e9-9b2d-4fd5-ad65-ddaf1216bb3c', ticketType: 'Standard', isCheckedIn: false},

{id: '42261a1b-0775-4dd4-8e7e-0d14ed6419dc', ticketType: 'Standard', isCheckedIn: false},

{id: 'b34cee2d-227a-4c03-ab7e-96463e485184', ticketType: 'Standard', isCheckedIn: false},

{id: '003100f6-675d-4a04-9241-4058826ace90', ticketType: 'Standard', isCheckedIn: false},

{id: '2da10dcf-1118-4b73-bbbf-5b8ef7ba8168', ticketType: 'Standard', isCheckedIn: false},

{id: '93cfd065-9c54-4f34-8f16-2b64eff7a0c4', ticketType: 'Standard', isCheckedIn: false},

{id: '95e02dcb-73ef-4068-b90c-5bab56a93acd', ticketType: 'Standard', isCheckedIn: false},

{id: '8a052b55-6380-40c8-86e0-7cae3433d24f', ticketType: 'Standard', isCheckedIn: false},

{id: 'eb04fe0c-f5ff-445d-8441-25b39e680f71', ticketType: 'Standard', isCheckedIn: false},
 
{id: 'cb497a88-5735-4dd1-8e76-8b12e836949e', ticketType: 'Standard', isCheckedIn: false},

{id: '028f6abc-cd8d-4b44-957e-1db69738b1ff', ticketType: 'Standard', isCheckedIn: false},

{id: '4f255792-b93a-4e36-ae0a-d02299cf1698', ticketType: 'Standard', isCheckedIn: false},

{id: '9bbdc020-ebf9-4bbc-ba83-03abaf64cec9', ticketType: 'Standard', isCheckedIn: false},

{id: 'd23b71d2-5894-4527-b61f-6992e43d20df', ticketType: 'Standard', isCheckedIn: false},

{id: '1301e21a-23c5-48f8-a671-cc3e3a1b116a', ticketType: 'Standard', isCheckedIn: false},

{id: '38ab9222-b4e6-4aa6-ad70-3e55e0ba5b2b', ticketType: 'Standard', isCheckedIn: false},

{id: '52f73fd5-d30c-4f12-8bdc-91f78fb0ee33', ticketType: 'Standard', isCheckedIn: false},

{id: 'bfc22111-a49d-4d07-9d85-b1c8d68aebaf', ticketType: 'Standard', isCheckedIn: false},

{id: '5acc89ee-e709-43f6-b241-bdd03a7145f2', ticketType: 'Standard', isCheckedIn: false},

{id: '778cae3c-90a7-4902-925d-9780c7f8452b', ticketType: 'Standard', isCheckedIn: false},

{id: '82e6b79f-26a0-4552-a4af-07c50adcee72', ticketType: 'Standard', isCheckedIn: false},

{id: 'c4d8b45b-d551-444e-96bb-b0da7e693f8a', ticketType: 'Standard', isCheckedIn: false},

{id: '9eeb2ca4-191b-4bea-aeab-1bf56a8499fb', ticketType: 'Standard', isCheckedIn: false},

{id: 'b7bc9a13-f448-43cb-b223-debcdc72a9fa', ticketType: 'Standard', isCheckedIn: false},

{id: '40b7e8fd-80bc-4440-ba9f-2d7d6edb80d1', ticketType: 'Standard', isCheckedIn: false},

{id: 'a727e2c9-99ea-4ed8-b227-9642c86db1e4', ticketType: 'Standard', isCheckedIn: false},

{id: '4ee3a8e9-cc8e-490a-a55e-48ebd8974983', ticketType: 'Standard', isCheckedIn: false},

{id: '203dd56f-690c-4601-a724-d22a495c015c', ticketType: 'Standard', isCheckedIn: false},

{id: '8b534f43-fa24-4c09-81f7-d8e5389d72e7', ticketType: 'Standard', isCheckedIn: false},

{id: '2e186e63-db3b-4d0a-8294-415a82e244cc', ticketType: 'Standard', isCheckedIn: false},

{id: '2a32ae58-fc81-41a2-9625-0687c83020ed', ticketType: 'Standard', isCheckedIn: false},

{id: 'dcb411ff-e8de-4a0f-99fd-1d28dbcd4039', ticketType: 'Standard', isCheckedIn: false},

{id: '99263f38-d8d7-4801-b877-0e5f600d1230', ticketType: 'Standard', isCheckedIn: false},

{id: 'fffad3b0-44ef-47a0-a725-d00f64dfed1d', ticketType: 'Standard', isCheckedIn: false},

{id: '3c780043-a631-4242-b68d-98f5ad0f0fd2', ticketType: 'Standard', isCheckedIn: false},

{id: 'd7297f7f-c3bc-4842-8296-10977b6c9bb0', ticketType: 'Standard', isCheckedIn: false},

{id: '538c0c5e-9c22-48ac-9289-098c20392ab1', ticketType: 'Standard', isCheckedIn: false},

{id: 'a0cbf587-49de-4ddb-9142-b39641c30c4e', ticketType: 'Standard', isCheckedIn: false},

{id: '2e7127ac-e3e1-4b96-9727-001ba2b42bee', ticketType: 'Standard', isCheckedIn: false},

{id: 'b7eb2daa-87d1-4836-a8f3-cbf83fd1d17c', ticketType: 'Standard', isCheckedIn: false},

{id: 'a3982a41-b045-4922-80b1-b037fd8f2551', ticketType: 'Standard', isCheckedIn: false},

{id: '6fa11186-e367-42c5-83ca-f0c998e93b46', ticketType: 'Standard', isCheckedIn: false},

{id: '9d7a2951-f0c5-4a68-9add-21c609f97612', ticketType: 'Standard', isCheckedIn: false},

{id: '41be449f-6a6f-4877-a03e-4be6da64f8d0', ticketType: 'Standard', isCheckedIn: false},

{id: 'e61c9bae-3a54-410e-98ab-34ad4d9a70b2', ticketType: 'Standard', isCheckedIn: false},

{id: '759f85e2-3dc0-49ec-860b-e856cbb8b529', ticketType: 'Standard', isCheckedIn: false},

{id: '66224427-5553-4938-93e2-945c166f2089', ticketType: 'Standard', isCheckedIn: false},

{id: 'f4b83874-8c44-418d-a174-02f2577cfe90', ticketType: 'Standard', isCheckedIn: false},

{id: 'ea7a22a1-202c-4d13-be25-f3d5d997c61e', ticketType: 'Standard', isCheckedIn: false},

{id: 'febb30db-7be1-4f5b-9f39-1b6155796524', ticketType: 'Standard', isCheckedIn: false},
 
{id: '33dbdb62-e898-4db3-9e8b-2dd19db76883', ticketType: 'Standard', isCheckedIn: false},

{id: 'a36bcec7-655f-45a7-9f13-1f5d6e5a8e0b', ticketType: 'Standard', isCheckedIn: false},

{id: '349552ac-19b3-494c-b19f-f3acfebfd76b', ticketType: 'Standard', isCheckedIn: false},
 
{id: '73792970-a055-405a-9d2f-997e59a9956d', ticketType: 'Standard', isCheckedIn: false},

{id: '284c9b6d-30f4-4498-b253-c2ceeca7a52f', ticketType: 'Standard', isCheckedIn: false},

{id: '44ba9d93-ee18-4fcf-8d19-ccf9ee58d55a', ticketType: 'Standard', isCheckedIn: false},

{id: '23c3befe-04c5-457a-a50f-dd10241fec91', ticketType: 'Standard', isCheckedIn: false},

{id: '2d3daed2-892d-40e8-b962-4198df575a94', ticketType: 'Standard', isCheckedIn: false},

{id: '9a1df0fa-64ad-43ca-8a39-95c33acf1285', ticketType: 'Standard', isCheckedIn: false},
 
{id: 'fa365dce-12e7-4e09-8f17-717cceba89ca', ticketType: 'Standard', isCheckedIn: false},
{id: '3036259c-12ea-4380-a2be-39d40ec03943', ticketType: 'Standard', isCheckedIn: false},
{id: 'f9f499b6-ffbc-43d6-a9fd-022b96ccba08', ticketType: 'Standard', isCheckedIn: false},
{id: 'b0fc40a6-4b6a-4a84-bda0-84459109e071', ticketType: 'Standard', isCheckedIn: false},
{id: 'f0692cdb-48b3-4afd-b8bd-3147093bb85d', ticketType: 'Standard', isCheckedIn: false},
{id: 'ff0692a3-5598-4d03-b4ec-90b5c2dbd58a', ticketType: 'Standard', isCheckedIn: false},
{id: 'ce87b8f6-17a3-4554-ba9a-0a32a20251e8', ticketType: 'Standard', isCheckedIn: false},
{id: '15a05186-6d3a-4c66-9461-229d5efe6a20', ticketType: 'Standard', isCheckedIn: false},
{id: 'bb088e1a-71ba-4d6c-8157-c028eba767e0', ticketType: 'Standard', isCheckedIn: false},
{id: '8dcb4c0c-24bd-4c6f-9870-44ed995b750e', ticketType: 'Standard', isCheckedIn: false},
{id: '7e5bd824-b49a-4379-85cd-941b3e9bbbec', ticketType: 'Standard', isCheckedIn: false},
{id: '79911fc8-432e-4c8f-8f39-373c0dc0cd2e', ticketType: 'Standard', isCheckedIn: false},
{id: 'c3284637-f999-4d93-8bc1-43c2ba4fe950', ticketType: 'Standard', isCheckedIn: false},
{id: 'bfd941aa-a986-41af-b04b-c2a455bbb2d5', ticketType: 'Standard', isCheckedIn: false},
{id: 'a60b9b0b-ba7d-4e64-a1c6-62f99c9f4195', ticketType: 'Standard', isCheckedIn: false},
{id: '48615d23-2434-45c8-ab79-1aa5a0f576ce', ticketType: 'Standard', isCheckedIn: false},
{id: 'd8177d37-e221-4c3f-bc49-f11fc5ab762e', ticketType: 'Standard', isCheckedIn: false},
{id: 'ebb223f8-06db-4e17-9984-d29f351bd30d', ticketType: 'Standard', isCheckedIn: false},

];
  



// const [validIds, setValidIds] = useState([]);
//@ts-ignore



export const validateAttendee = (scannedId: string): ScanResult => {
  /*fetch('/allattendees.csv')
  .then(response => response.text())
  .then(csvText => {
    Papa.parse(csvText, {
      header: false, // don't treat first row as header
      skipEmptyLines: true,
      //@ts-ignore
      complete: function (results) {
        const data = results.data;
        // Skip header row, then extract only the first column (index 0)
        //@ts-ignore
         validIds = data.slice(1).map(row => ({
          id: row[0].trim(),
          ticketType: 'Standard',
          isCheckedIn: false
        }));
        
        // setValidIds(attendeeObjects);
        console.log("ids",validIds);
       
      },
      //@ts-ignore
      error: function (error) {
        console.error('Error parsing CSV:', error);
      }
    });
  });*/
  //@ts-ignore
  const attendee = attendees.find(a => a.id === scannedId);
  
  if (!attendee) {
    return {
      attendeeId: scannedId,
      timestamp: new Date(),
      isValid: false,
      message: 'Invalid attendee ID. This person is not registered.'
    };
  }
  //@ts-ignore
  if (attendee.isCheckedIn) {
    return {
      attendeeId: scannedId,
      timestamp: new Date(),
      isValid: false,
      attendee,
      message: 'This attendee has already checked in.'
    };
  }
  
  // Mark as checked in
  const updatedAttendee = { 
    //@ts-ignore
    ...attendee, 
    isCheckedIn: true,
    checkInTime: new Date()
  };
  
  // Update the mock database
  //@ts-ignore
  const index = attendees.findIndex(a => a.id === scannedId);
  if (index !== -1) {
    //@ts-ignore
    attendees[index] = updatedAttendee;
  }
  
  return {
    attendeeId: scannedId,
    timestamp: new Date(),
    isValid: true,
    attendee: updatedAttendee,
    message: 'Check-in successful!'
  };
};

export const getAttendeeById = (id: string): Attendee | undefined => {
  //@ts-ignore
  return attendees.find(a => a.id === id);
};

export const resetAttendeeCheckIn = (id: string): boolean => {
  //@ts-ignore
  const index = attendees.findIndex(a => a.id === id);
  if (index !== -1) {
    //@ts-ignore
    validIds[index] = {
      //@ts-ignore
      ...attendees[index],
      isCheckedIn: false,
      checkInTime: undefined
    };
    return true;
  }
  return false;
};