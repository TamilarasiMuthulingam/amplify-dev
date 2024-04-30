
import { generateClient } from 'aws-amplify/api';
import { getAllRecords1 } from './graphql/queries';
import { getAllRecords2 } from './graphql/queries';
 
const client = generateClient();
 
export const GetData = async () => {
  try {
    const result = await client.graphql({ query: getAllRecords1 });
    console.log(result);
    return result.data.getAllRecords1;
  } catch (error) {
    throw error;
  }
};
 
 
export const getData1= async () => {
  try {
    const result = await client.graphql({ query: getAllRecords2 });
    console.log(result);
    return result.data.getAllRecords2;
    
  } catch (error) {
    throw error;
  }
};