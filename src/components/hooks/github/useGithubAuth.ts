import { ref } from "vue";
import { shell } from "@tauri-apps/api";

const accessToken = ref<string | null>(null);
const refreshToken = ref<string | null>(null);
const isFetchingToken = ref<boolean>(false);

const handleParseCode = async (code: string | undefined) => {
  if (!code || code === null) return;

  const parameters = code.split("?");
  const [returnCode, returnState] = parameters[1].split("&");
  const returnedCode = returnCode.split("=")[1];
  const returnedState = returnState.split("=")[1];

  if (returnedState !== import.meta.env.VITE_GITHUB_STATE) {
    return;
  }

  await handleFetchToken(returnedCode);
};

const handleSignIn = () => {
  shell.open(
    `https://github.com/login/oauth/authorize?client_id=${
      import.meta.env.VITE_GITHUB_CLIENT_ID
    }&redirect_uri=md-scheme://github&allow_signup=true&scope=repo,user&state=${
      import.meta.env.VITE_GITHUB_STATE
    }`
  );
};

const handleFetchToken = (code: string) => {
  console.log(code);
  if (!isFetchingToken.value) {
    isFetchingToken.value = true;
    try {
      console.log("Trying to fetch");
      fetch("http://localhost:4000/login", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          code: code,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json(); // Parse the JSON content of the response
        })
        .then((data) => {
          console.log(data); // Log the parsed JSON data
          // Do something with the data here
          accessToken.value = data.access_token;
          localStorage.setItem("refresh_token", data.refresh_token);
        })
        .catch((error) => {
          console.error("Error fetching token:", error);
        })
        .finally(() => {
          isFetchingToken.value = false;
        });
    } catch (error) {
      console.error("Error fetching token:", error);
      isFetchingToken.value = false;
    }
  }
};

const createRepo = async () => {
  const data = {
    name: "Test Repository",
    description: "MD Scheme Test Repository",
    private: true, // Set to true if you want to create a private repository
  };

  const headers = {
    Authorization: `Bearer ${accessToken.value}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Repository created successfully:", responseData.html_url);
      return responseData;
    } else {
      const errorData = await response.json();
      console.error("Error creating repository:", errorData.message);
      throw new Error(errorData.message);
    }
  } catch (error) {
    console.error("Error creating repository:", error);
    throw error;
  }
};

const useGithubAuth = () => {
  return {
    accessToken,
    refreshToken,
    handleSignIn,
    handleFetchToken,
    handleParseCode,
    createRepo,
  };
};

export default useGithubAuth;
