import createClient from "@superbase/superbase-js";

const superbaseURL = process.env.NEXT_PUBLIC_SUPERBASE_URL;
const superbaseAnonKey = process.env.NEXT_PUBLIC_SUPERBASE_ANON_KEY;

export const superbaseClient = createClient(superbaseURL,superbaseAnonKey)