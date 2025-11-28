import client from "../apolloClient";
import { GET_FOOTER } from "./footerQuery";

export const fetchFooter = async () => {
  try {
    const { data } = await client.query({
      query: GET_FOOTER,
      fetchPolicy: 'network-only', 
    });

    return data.Footer || null;
  } catch (error) {
    console.error("Error fetching footer:", error);
    return null;
  }
};
