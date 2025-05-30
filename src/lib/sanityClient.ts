import {createClient} from "@sanity/client";

export const sanityClient = createClient({
	projectId: '53lmzl4s',
	dataset: 'production',
	apiVersion: '2025-05-30',
	useCdn: false
})